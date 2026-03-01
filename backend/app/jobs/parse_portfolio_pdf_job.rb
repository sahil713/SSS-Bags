# frozen_string_literal: true

class ParsePortfolioPdfJob < ApplicationJob
  queue_as :default

  def perform(statement_id)
    statement = PortfolioStatement.find_by(id: statement_id)
    return unless statement

    statement.update!(parse_status: "processing")

    result = GrowwFileParser.parse(statement)
    holdings = result[:holdings] || []

    # Store parsed data (holdings, PnL, tax, etc.)
    statement.update!(
      parse_status: result.present? ? "completed" : "failed",
      parsed_data: result,
      parsed_holdings: holdings
    )

    user = statement.user
    base_date = statement.statement_date || statement.created_at.to_date

    # Create holdings from holdings-type docs
    if statement.document_type == "holdings" && holdings.any?
      holdings.each do |h|
        symbol = h[:symbol].to_s
        next if symbol.blank?

        existing = user.holdings.find_by(symbol: symbol)
        attrs = {
          quantity: h[:quantity],
          avg_price: h[:avg_price],
          holding_type: h[:holding_type] || "equity",
          source: "pdf"
        }
        attrs[:current_price] = h[:current_price] if h[:current_price].present?
        attrs[:isin] = h[:isin] if h[:isin].present?
        attrs[:name] = h[:name] if h[:name].present?

        if existing
          existing.update!(attrs)
        else
          user.holdings.create!(attrs.merge(symbol: symbol))
        end
      end
    end

    # Persist P&L to investment_pnl_records
    persist_pnl(user, statement, result, base_date)

    # Persist tax to investment_tax_records
    persist_tax(user, statement, result, base_date)

    # Persist transactions to investment_transactions
    persist_transactions(user, statement, result)
  rescue StandardError => e
    statement&.update!(parse_status: "failed")
    Rails.logger.error("ParsePortfolioPdfJob error: #{e.message}\n#{e.backtrace.first(5).join("\n")}")
  end

  private

  def persist_pnl(user, statement, result, base_date)
    return unless statement.document_type == "pnl"
    summary = result[:summary] || {}
    return if summary.empty?

    period_start = base_date.beginning_of_month
    period_end = base_date.end_of_month

    user.investment_pnl_records.create!(
      period_type: "monthly",
      period_start: period_start,
      period_end: period_end,
      realised_pnl: summary[:realised_pnl].to_f,
      unrealised_pnl: summary[:unrealised_pnl].to_f,
      dividend_income: result[:total_dividend].to_f,
      intraday_pnl: summary[:intraday_pnl].to_f,
      fno_pnl: summary[:fno_pnl].to_f,
      total_charges: summary[:total_charges].to_f,
      notes: "Parsed from #{statement.document_type}/#{statement.document_sub_type}"
    )
  rescue ActiveRecord::RecordInvalid => e
    Rails.logger.warn("ParsePortfolioPdfJob: Could not create P&L record: #{e.message}")
  end

  def persist_tax(user, statement, result, base_date)
    return unless statement.document_type == "tax"
    summary = result[:summary] || {}
    return if summary.empty?

    # Determine financial year from base_date (Apr-Mar)
    fy_year = base_date.month >= 4 ? base_date.year : base_date.year - 1
    financial_year = "#{fy_year}-#{String(fy_year + 1)[-2..]}"

    record = user.investment_tax_records.find_or_initialize_by(financial_year: financial_year)
    record.assign_attributes(
      stcg_amount: (record.stcg_amount.to_f + summary[:short_term_pnl].to_f).round(2),
      ltcg_amount: (record.ltcg_amount.to_f + summary[:long_term_pnl].to_f).round(2),
      intraday_pnl: (record.intraday_pnl.to_f + summary[:intraday_pnl].to_f).round(2),
      notes: [record.notes, "Parsed from #{statement.document_type}/#{statement.document_sub_type}"].compact.join("; ")
    )
    record.save!
  rescue ActiveRecord::RecordInvalid => e
    Rails.logger.warn("ParsePortfolioPdfJob: Could not create/update tax record: #{e.message}")
  end

  def persist_transactions(user, statement, result)
    return unless statement.document_type == "transactions"
    transactions = result[:transactions] || []
    return if transactions.empty?

    transactions.each do |t|
      raw_type = (t[:type] || t[:transaction_type]).to_s.upcase
      tx_type = case raw_type
                when "BUY", "PURCHASE", "SIP" then "buy"
                when "SELL", "REDEMPTION" then "sell"
                else nil
                end
      next unless tx_type

      symbol = t[:symbol] || t[:stock_name] || t[:scheme_name].to_s.gsub(/\s+/, "_").slice(0, 30)
      next if symbol.blank?

      quantity = t[:quantity].to_f
      quantity = t[:units].to_f if quantity.zero? && t[:units].present?
      price = t[:price].to_f
      price = t[:nav].to_f if price.zero? && t[:nav].present?
      amount = t[:amount].to_f || t[:value].to_f
      amount = quantity * price if amount.zero? && quantity.positive? && price.positive?

      date_str = t[:date] || t[:transaction_date] || t[:execution_date]
      tx_date = date_str.present? ? parse_date(date_str) : statement.statement_date || Date.current
      next unless tx_date

      user.investment_transactions.create!(
        transaction_type: tx_type,
        asset_type: statement.document_sub_type == "mf" ? "mf" : "stocks",
        symbol: symbol,
        name: t[:stock_name] || t[:scheme_name],
        quantity: quantity,
        price: price,
        amount: amount,
        transaction_date: tx_date,
        notes: "Parsed from document"
      )
    rescue ActiveRecord::RecordInvalid => e
      Rails.logger.warn("ParsePortfolioPdfJob: Could not create transaction: #{e.message}")
    end
  end

  def parse_date(str)
    return nil if str.blank?
    Date.parse(str.to_s)
  rescue ArgumentError
    nil
  end
end
