# frozen_string_literal: true

# Parses Groww XLSX exports (requires roo gem) based on document_type and document_sub_type.
# Format matches: Stocks_PnL_Report, Stocks_Holdings_Statement, Mutual_Funds_*,
# Stocks_Capital_Gains, Mutual_Funds_Capital_Gains, *_Order_History, Groww_Balance_Statement
class GrowwXlsxParser
  def self.parse(statement, doc_type, sub_type)
    require "roo"
    blob = statement.file.blob
    Tempfile.create(["groww", ".xlsx"]) do |tmp|
      tmp.binmode
      tmp.write(blob.download)
      tmp.rewind
      xlsx = ::Roo::Spreadsheet.open(tmp.path)
      sheet = xlsx.sheet(0)
      rows = sheet.to_a

      case doc_type
      when "pnl"
        sub_type == "stocks" ? parse_stocks_pnl(rows) : {}
      when "holdings"
        sub_type == "mf" ? parse_mf_holdings(rows) : parse_stocks_holdings(rows)
      when "tax"
        sub_type == "mf_elss" ? {} : parse_capital_gains(rows, sub_type)
      when "transactions"
        sub_type == "balance_statement" ? parse_balance_statement(rows) : parse_order_history(rows, sub_type)
      else
        {}
      end
    end
  rescue StandardError => e
    Rails.logger.error("GrowwXlsxParser error: #{e.message}\n#{e.backtrace.first(5).join("\n")}")
    {}
  end

  def self.parse_stocks_pnl(rows)
    summary = {}
    realised_trades = []
    unrealised_trades = []
    in_realised = false
    in_unrealised = false

    rows.each do |row|
      next if row.all?(&:blank?)
      cells = row.map { |c| c.to_s.strip }

      # Summary
      if cells[0] == "Realised P&L" && cells[1].present?
        summary[:realised_pnl] = parse_number(cells[1])
      elsif cells[0] == "Unrealised P&L" && cells[1].present?
        summary[:unrealised_pnl] = parse_number(cells[1])
      elsif cells[0] == "Total" && cells[1].present? && !summary[:total_charges]
        summary[:total_charges] = parse_number(cells[1])
      end

      # Section markers
      in_realised = true if cells[0] == "Stock name" && cells.include?("Sell date")
      in_unrealised = true if cells[0] == "Stock name" && cells.include?("Closing date")
      in_realised = false if in_unrealised
      in_unrealised = false if cells[0] == "Disclaimer:"

      # Realised trades: Stock name, ISIN, Quantity, Buy date, Buy price, Buy value, Sell date, Sell price, Sell value, Realised P&L
      if in_realised && cells[0].present? && cells[1].to_s.match?(/^INE[A-Z0-9]{9,10}$|^INF[A-Z0-9]{9}$/)
        realised_trades << {
          stock_name: cells[0],
          isin: cells[1],
          quantity: parse_number(cells[2]),
          buy_date: cells[3],
          buy_price: parse_number(cells[4]),
          sell_date: cells[5],
          sell_price: parse_number(cells[6]),
          realised_pnl: parse_number(cells[9]),
          remark: cells[10]
        }
      end

      # Unrealised trades
      if in_unrealised && cells[0].present? && cells[1].to_s.match?(/^INE[A-Z0-9]{9,10}$|^INF[A-Z0-9]{9}$/)
        unrealised_trades << {
          stock_name: cells[0],
          isin: cells[1],
          quantity: parse_number(cells[2]),
          buy_date: cells[3],
          buy_price: parse_number(cells[4]),
          closing_price: parse_number(cells[6]),
          unrealised_pnl: parse_number(cells[9])
        }
      end
    end

    {
      document_type: "pnl",
      sub_type: "stocks",
      summary: summary,
      realised_trades: realised_trades,
      unrealised_trades: unrealised_trades
    }
  end

  def self.parse_stocks_holdings(rows)
    holdings = []
    summary = {}
    in_holdings = false

    rows.each do |row|
      next if row.all?(&:blank?)
      cells = row.map { |c| c.to_s.strip }

      if cells[0] == "Invested Value" && cells[1].present?
        summary[:invested_value] = parse_number(cells[1])
      elsif cells[0] == "Closing Value" && cells[1].present?
        summary[:closing_value] = parse_number(cells[1])
      elsif cells[0] == "Unrealised P&L" && cells[1].present?
        summary[:unrealised_pnl] = parse_number(cells[1])
      end

      in_holdings = true if cells[0] == "Stock Name" && cells[1] == "ISIN"
      next unless in_holdings
      next if cells[0] == "Stock Name"

      next unless cells[0].present? && cells[1].to_s.match?(/^INE[A-Z0-9]{9,10}$|^INF[A-Z0-9]{9}$/)

      stock_name = cells[0]
      symbol = stock_to_symbol(stock_name)
      qty = parse_number(cells[2])
      avg_price = parse_number(cells[3])
      closing_price = parse_number(cells[5]) || avg_price

      holdings << {
        symbol: symbol,
        isin: cells[1],
        name: stock_name,
        quantity: qty,
        avg_price: avg_price,
        current_price: closing_price,
        holding_type: "equity",
        source: "pdf"
      }
    end

    { holdings: holdings, summary: summary }
  end

  def self.parse_mf_holdings(rows)
    holdings = []
    summary = {}
    in_holdings = false

    rows.each_with_index do |row, idx|
      next if row.all?(&:blank?)
      cells = row.map { |c| c.to_s.strip }

      # Two-row summary format: header row has "Total Investments", "Current Portfolio Value", etc.; values in next row
      if cells[0] == "Total Investments" && cells[1] == "Current Portfolio Value"
        next_row = rows[idx + 1]
        if next_row.present?
          next_cells = next_row.map { |c| c.to_s.strip }
          summary[:total_investments] = parse_number(next_cells[0])
          summary[:current_value] = parse_number(next_cells[1])
          summary[:pnl] = parse_number(next_cells[2])
        end
      elsif cells[0] == "Total Investments" && cells[1].present? && !cells[1].include?("Portfolio")
        summary[:total_investments] = parse_number(cells[1])
      elsif cells[0] == "Current Portfolio Value" && cells[1].present?
        summary[:current_value] = parse_number(cells[1])
      elsif cells[0] == "Profit/Loss" && cells[1].present?
        summary[:pnl] = parse_number(cells[1])
      end

      in_holdings = true if cells[0] == "Scheme Name" && cells[1] == "AMC"
      next unless in_holdings
      next if cells[0] == "Scheme Name"

      next unless cells[0].present? && cells[6].present?

      scheme_name = cells[0]
      units = parse_number(cells[6])
      invested = parse_number(cells[7])
      current_val = parse_number(cells[8])
      nav = units.positive? ? (current_val / units) : 0
      avg_price = units.positive? ? (invested / units) : 0

      symbol = scheme_name.gsub(/\s+/, "_").slice(0, 30)
      holdings << {
        symbol: symbol,
        isin: nil,
        name: scheme_name,
        quantity: units,
        avg_price: avg_price,
        current_price: nav,
        holding_type: "mf",
        source: "pdf"
      }
    end

    { holdings: holdings, summary: summary }
  end

  def self.parse_capital_gains(rows, sub_type)
    summary = {}
    rows.each do |row|
      next if row.all?(&:blank?)
      cells = row.map { |c| c.to_s.strip }
      if cells[0] == "Short Term P&L" && cells[1].present?
        summary[:short_term_pnl] = parse_number(cells[1])
      elsif cells[0] == "Long Term P&L" && cells[1].present?
        summary[:long_term_pnl] = parse_number(cells[1])
      elsif cells[0] == "Intraday P&L" && cells[1].present?
        summary[:intraday_pnl] = parse_number(cells[1])
      elsif cells[0] == "Total" && cells[1].present?
        summary[:total_charges] ||= parse_number(cells[1])
      elsif cells[0] == "Dividends" && cells[1].present?
        summary[:dividends] = parse_number(cells[1])
      elsif cells[2] == "Short Term P&L" && cells[3].present?
        summary[:short_term_pnl] = parse_number(cells[3])
      elsif cells[2] == "Long Term P&L" && cells[3].present?
        summary[:long_term_pnl] = parse_number(cells[3])
      end
    end
    result = { document_type: "tax", sub_type: sub_type, summary: summary }
    result[:total_dividend] = summary[:dividends].to_f if summary[:dividends].present?
    result
  end

  def self.parse_order_history(rows, sub_type)
    transactions = []
    in_txns = false

    rows.each do |row|
      next if row.all?(&:blank?)
      cells = row.map { |c| c.to_s.strip }

      if sub_type == "stocks"
        in_txns = true if cells[0] == "Stock name" && cells[1] == "Symbol"
        next unless in_txns
        next if cells[0] == "Stock name"
        next unless cells[0].present? && %w[BUY SELL].include?(cells[3].to_s.upcase)

        transactions << {
          stock_name: cells[0],
          symbol: cells[1],
          isin: cells[2],
          type: cells[3],
          quantity: parse_number(cells[4]),
          value: parse_number(cells[5]),
          date: cells[8],
          status: cells[9]
        }
      else
        in_txns = true if cells[0] == "Scheme Name" && cells[1] == "Transaction Type"
        next unless in_txns
        next if cells[0] == "Scheme Name"
        next unless cells[0].present?

        transactions << {
          scheme_name: cells[0],
          type: cells[1],
          units: parse_number(cells[2]),
          nav: parse_number(cells[3]),
          amount: parse_number(cells[4]),
          date: cells[5]
        }
      end
    end

    { document_type: "transactions", sub_type: sub_type, transactions: transactions }
  end

  def self.parse_balance_statement(rows)
    transactions = []
    in_txns = false

    rows.each do |row|
      next if row.all?(&:blank?)
      cells = row.map { |c| c.to_s.strip }

      in_txns = true if cells[0] == "Transaction Date" && cells[1] == "Settlement Date"
      next unless in_txns
      next if cells[0] == "Transaction Date"
      next unless cells[0].present? && cells[0].match?(/\d{2}-\d{2}-\d{4}/)

      debit = parse_number(cells[9])
      credit = parse_number(cells[10])
      balance = parse_number(cells[11])

      transactions << {
        transaction_date: cells[0],
        settlement_date: cells[1],
        segment: cells[3],
        transaction_type: cells[6],
        debit: debit,
        credit: credit,
        balance: balance
      }
    end

    opening = transactions.last&.dig(:balance)
    closing = transactions.first&.dig(:balance)

    {
      document_type: "transactions",
      sub_type: "balance_statement",
      transactions: transactions,
      opening_balance: opening,
      closing_balance: closing
    }
  end

  def self.parse_number(str)
    return 0 if str.blank?
    str.to_s.gsub(/[₹,\s]/, "").to_f
  end

  STOCK_SYMBOLS = {
    "FUTURE CONSUMER LIMITED" => "FCONSUMER",
    "GUJARAT TOOLROOM LTD." => "GTOOL",
    "IFL ENTERPRISES LIMITED" => "IFL",
    "PC JEWELLER LTD" => "PCJEWELLER",
    "QUASAR INDIA LTD" => "QUASAR",
    "RAIL VIKAS NIGAM LIMITED" => "RVNL",
    "STEEL AUTHORITY OF INDIA" => "SAIL",
    "BSE LIMITED" => "BSE",
    "NHPC LTD" => "NHPC",
    "TATAAML-TATSILV" => "TATAAML",
    "CENTRAL DEPO SER (I) LTD" => "CDSL"
  }.freeze

  def self.stock_to_symbol(name)
    return "UNKNOWN" if name.blank?
    key = name.to_s.upcase.strip
    return STOCK_SYMBOLS[key] if STOCK_SYMBOLS.key?(key)
    words = key.split(/\s+/)
    return words[0] if words.size == 1
    first = words[0]
    return first if first.length >= 2 && first.length <= 12
    words.map { |w| w[0] }.join
  end
end
