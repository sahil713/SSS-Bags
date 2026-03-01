# frozen_string_literal: true

module Api
  module V1
    module Customer
      class InvestmentsController < InvestmentsBaseController
        def document_types
          render json: { document_types: GrowwDocumentTypes.as_json }
        end

        def parsed_summary
          manual = aggregate_manual_data
          render json: manual
        end

        def build_portfolio_from_documents
          statements = current_user.portfolio_statements.where(parse_status: "completed")
          holdings_created = 0
          statements.each do |stmt|
            next unless %w[holdings].include?(stmt.document_type.to_s)
            result = stmt.parsed_data || {}
            holdings = result[:holdings] || stmt.parsed_holdings || []
            next if holdings.empty?

            holdings.each do |h|
              symbol = h[:symbol].to_s
              next if symbol.blank?

              existing = current_user.holdings.find_by(symbol: symbol)
              attrs = {
                quantity: h[:quantity],
                avg_price: h[:avg_price],
                holding_type: h[:holding_type] || "equity",
                source: "pdf"
              }
              attrs[:isin] = h[:isin] if h[:isin].present?
              attrs[:name] = h[:name] if h[:name].present?
              attrs[:current_price] = h[:current_price] if h[:current_price].present?

              if existing
                existing.update!(attrs)
              else
                current_user.holdings.create!(attrs.merge(symbol: symbol))
                holdings_created += 1
              end
            end
          end
          portfolio = fetch_portfolio_from_holdings
          render json: {
            message: "Portfolio built from #{statements.count} documents. #{holdings_created} new holdings added.",
            portfolio: portfolio
          }
        end

        def investing_opportunities
          parsed = aggregate_manual_data
          holdings = current_user.holdings
          totals = compute_holdings_totals(holdings)
          opportunities = build_opportunities(holdings, totals, parsed)
          render json: { opportunities: opportunities, parsed_summary: parsed }
        end

        def dashboard
          portfolio = fetch_portfolio_from_holdings
          parsed = aggregate_manual_data
          opportunities = build_opportunities(current_user.holdings, portfolio, parsed)
          render json: {
            portfolio: portfolio,
            holdings_count: current_user.holdings.count,
            parsed_summary: parsed,
            opportunities: opportunities
          }
        end

        def portfolio
          holdings = current_user.holdings
          totals = compute_holdings_totals(holdings)
          parsed = aggregate_manual_data
          render json: {
            success: true,
            holdings: holdings.map { |h| holding_json(h) },
            total_value: totals[:total_value],
            total_pnl: totals[:total_pnl],
            total_pnl_percent: totals[:total_pnl_percent],
            parsed_summary: parsed
          }
        end

        def sync
          # Create snapshot from current holdings for reports
          holdings = current_user.holdings
          totals = compute_holdings_totals(holdings)
          current_user.portfolio_snapshots.create!(
            holdings: holdings.map { |h| holding_json(h) },
            total_value: totals[:total_value],
            total_pnl: totals[:total_pnl],
            total_pnl_percent: totals[:total_pnl_percent],
            synced_at: Time.current
          )
          render json: { message: "Portfolio snapshot saved" }
        end

        def reports
          snapshots = current_user.portfolio_snapshots.by_date.limit(50)
          pnl_records = current_user.investment_pnl_records.by_period.limit(24)
          render json: {
            snapshots: snapshots.map { |s| report_snapshot_json(s) },
            pnl_chart_data: pnl_chart_data(pnl_records)
          }
        end

        def export_report
          format = params[:format] || "csv"
          unless %w[csv pdf].include?(format)
            return render json: { error: "Invalid format. Use: csv, pdf" }, status: :unprocessable_entity
          end

          snapshots = current_user.portfolio_snapshots.by_date.limit(365)
          if format == "csv"
            csv = report_to_csv(snapshots)
            send_data csv, filename: "portfolio_report_#{Date.current}.csv", type: "text/csv"
          else
            # PDF stub - would use Prawn or similar
            render json: { message: "PDF export coming soon" }, status: :not_implemented
          end
        end

        def sell_timing
          horizon = params[:horizon]&.to_i
          horizons = RecommendationService::SELL_TIMING_OPTIONS
          unless horizon && horizons.include?(horizon)
            return render json: { error: "Invalid horizon. Use: #{horizons.join(', ')}" }, status: :unprocessable_entity
          end

          # Stub - return placeholder
          render json: { horizon_days: horizon, suggestions: [] }
        end

        def tips
          mode = params[:mode] || "combined"
          symbol = params[:symbol]
          parsed = aggregate_manual_data
          holdings = current_user.holdings
          totals = compute_holdings_totals(holdings)

          rule_signals = symbol ? RecommendationService.rule_based_signals(symbol, {}) : {}
          model_tips = build_model_based_tips(holdings, totals, parsed)

          render json: {
            mode: mode,
            rule_based: rule_signals,
            ai: [],
            model_based: model_tips,
            combined: model_tips + [rule_signals].compact
          }
        end

        private

        def build_model_based_tips(holdings, totals, parsed)
          tips = []
          t = parsed[:totals] || {}

          # Diversification
          equity_count = holdings.count { |h| h.holding_type == "equity" }
          mf_count = holdings.count { |h| h.holding_type == "mf" }
          if equity_count > 0 && mf_count == 0
            tips << { type: "diversification", title: "Add Mutual Funds", description: "Diversify with MF for lower volatility.", priority: "medium" }
          elsif mf_count > 0 && equity_count == 0
            tips << { type: "diversification", title: "Consider direct equity", description: "Direct stocks can offer higher growth.", priority: "low" }
          end

          # Tax planning from manual data
          stcg = t[:short_term_capital_gains].to_f
          ltcg = t[:long_term_capital_gains].to_f
          if stcg != 0 || ltcg != 0
            tips << { type: "tax", title: "Tax planning", description: "STCG: ₹#{stcg.round(0)} | LTCG: ₹#{ltcg.round(0)}. Plan ITR accordingly.", priority: "info" }
          end

          # P&L performance
          if totals[:total_pnl_percent].to_f < -10
            tips << { type: "portfolio", title: "Review portfolio", description: "P&L at #{totals[:total_pnl_percent].round(1)}%. Consider rebalancing.", priority: "warning" }
          elsif totals[:total_pnl_percent].to_f > 20
            tips << { type: "portfolio", title: "Consider booking profits", description: "Strong gains. Review exit strategy.", priority: "success" }
          end

          tips
        end

        def build_opportunities(holdings, portfolio_or_totals, parsed)
          opportunities = []
          totals = portfolio_or_totals.is_a?(Hash) ? portfolio_or_totals : compute_holdings_totals(holdings)
          t = parsed[:totals] || {}

          # Diversification
          equity_count = holdings.count { |h| h.holding_type == "equity" }
          mf_count = holdings.count { |h| h.holding_type == "mf" }
          if equity_count > 0 && mf_count == 0
            opportunities << {
              type: "diversification",
              title: "Consider adding Mutual Funds",
              description: "You have #{equity_count} equity holdings. Adding mutual funds can diversify risk.",
              priority: "medium"
            }
          elsif mf_count > 0 && equity_count == 0
            opportunities << {
              type: "diversification",
              title: "Consider direct equity",
              description: "You have #{mf_count} MF holdings. Direct stocks can offer higher growth potential.",
              priority: "low"
            }
          end

          # Dividend income
          div_total = t[:total_dividend].to_f
          if div_total > 0
            div_yield = totals[:total_value].to_f.positive? ? (div_total / totals[:total_value] * 100) : 0
            opportunities << {
              type: "dividend",
              title: "Dividend income",
              description: "₹#{div_total.round(0)} dividend from your documents. Yield: #{div_yield.round(2)}%",
              value: div_total,
              priority: "info"
            }
          end

          # P&L performance
          realised = t[:realised_pnl].to_f
          unrealised = t[:unrealised_pnl].to_f
          if realised != 0 || unrealised != 0
            opportunities << {
              type: "pnl",
              title: "Trading performance",
              description: "Realised P&L: ₹#{realised.round(0)} | Unrealised: ₹#{unrealised.round(0)}",
              value: realised + unrealised,
              priority: realised >= 0 ? "success" : "warning"
            }
          end

          # Tax planning
          stcg = t[:short_term_capital_gains].to_f
          ltcg = t[:long_term_capital_gains].to_f
          if stcg != 0 || ltcg != 0
            opportunities << {
              type: "tax",
              title: "Capital gains for tax",
              description: "STCG: ₹#{stcg.round(0)} | LTCG: ₹#{ltcg.round(0)}. Plan ITR accordingly.",
              priority: "info"
            }
          end

          # Portfolio health
          if holdings.any? && totals[:total_pnl_percent].to_f < -10
            opportunities << {
              type: "portfolio",
              title: "Portfolio review",
              description: "Overall P&L is #{totals[:total_pnl_percent].round(1)}%. Consider reviewing underperformers.",
              priority: "warning"
            }
          end

          opportunities
        end

        def aggregate_manual_data
          totals = {
            realised_pnl: 0,
            unrealised_pnl: 0,
            total_dividend: 0,
            short_term_capital_gains: 0,
            long_term_capital_gains: 0,
            total_charges: 0
          }
          # From manual P&L records
          current_user.investment_pnl_records.find_each do |r|
            totals[:realised_pnl] += r.realised_pnl.to_f
            totals[:unrealised_pnl] += r.unrealised_pnl.to_f
            totals[:total_dividend] += r.dividend_income.to_f
            totals[:short_term_capital_gains] += r.realised_pnl.to_f
            totals[:total_charges] += r.total_charges.to_f
          end
          # From manual tax records
          current_user.investment_tax_records.find_each do |r|
            totals[:short_term_capital_gains] += r.stcg_amount.to_f
            totals[:long_term_capital_gains] += r.ltcg_amount.to_f
          end
          # From parsed documents (portfolio_statements) - backwards compat and docs parsed before persist
          current_user.portfolio_statements.where(parse_status: "completed").find_each do |s|
            data = s.parsed_data || {}
            if (summary = data[:summary])
              totals[:realised_pnl] += summary[:realised_pnl].to_f
              totals[:unrealised_pnl] += summary[:unrealised_pnl].to_f
              totals[:short_term_capital_gains] += summary[:short_term_pnl].to_f
              totals[:long_term_capital_gains] += summary[:long_term_pnl].to_f
              totals[:total_charges] += summary[:total_charges].to_f
              totals[:total_dividend] += summary[:dividends].to_f
            end
            totals[:total_dividend] += data[:total_dividend].to_f
          end
          docs_count = current_user.portfolio_statements.where(parse_status: "completed").count
          {
            totals: totals,
            dividends_count: 0,
            documents_parsed: docs_count
          }
        end

        def pnl_chart_data(pnl_records)
          pnl_records.map do |r|
            {
              time: r.period_start.to_s,
              date: r.period_start.to_s,
              value: r.total_pnl.to_f,
              close: r.total_pnl.to_f,
              realised_pnl: r.realised_pnl.to_f,
              unrealised_pnl: r.unrealised_pnl.to_f,
              dividend_income: r.dividend_income.to_f
            }
          end
        end

        def report_snapshot_json(s)
          {
            id: s.id,
            total_value: s.total_value,
            total_pnl: s.total_pnl,
            total_pnl_percent: s.total_pnl_percent,
            synced_at: s.synced_at
          }
        end

        def report_to_csv(snapshots)
          require "csv"
          CSV.generate do |csv|
            csv << %w[Date Total_Value PnL PnL_Percent]
            snapshots.each do |s|
              csv << [
                s.synced_at&.strftime("%Y-%m-%d"),
                s.total_value,
                s.total_pnl,
                s.total_pnl_percent
              ]
            end
          end
        end

        def fetch_portfolio_from_holdings
          holdings = current_user.holdings
          totals = compute_holdings_totals(holdings)
          {
            total_value: totals[:total_value],
            total_pnl: totals[:total_pnl],
            total_pnl_percent: totals[:total_pnl_percent],
            holdings_count: holdings.size
          }
        end

        def compute_holdings_totals(holdings)
          total_value = holdings.sum(&:current_value)
          total_cost = holdings.sum(&:cost_basis)
          total_pnl = total_value - total_cost
          total_pnl_percent = total_cost.positive? ? (total_pnl / total_cost * 100) : 0
          {
            total_value: total_value.round(2),
            total_pnl: total_pnl.round(2),
            total_pnl_percent: total_pnl_percent.round(2)
          }
        end

        def holding_json(h)
          {
            id: h.id,
            symbol: h.symbol,
            isin: h.isin,
            name: h.name,
            quantity: h.quantity.to_f,
            avg_price: h.avg_price.to_f,
            current_price: h.current_price&.to_f,
            value: h.current_value.to_f,
            pnl: h.pnl.to_f,
            pnl_percent: h.pnl_percent,
            holding_type: h.holding_type,
            source: h.source
          }
        end
      end
    end
  end
end
