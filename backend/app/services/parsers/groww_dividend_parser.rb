# frozen_string_literal: true

# Parses Groww Dividend Report PDF
# Format: Company Name ISIN Ex Date Number of Shares Dividend per Share Net Dividend Amount
# Example: ITC LTD INE154A01025 28-05-2025 99 Rs. 7.85 Rs. 777.15
module Parsers
  class GrowwDividendParser
    def self.parse(text, _sub_type, _statement)
      dividends = []
      total = nil
      lines = text.split("\n").map(&:strip).reject(&:blank?)

      lines.each do |line|
        if line.match?(/Total dividend amount\s+Rs\.\s*([\d,.]+)/i)
          total = line.match(/Rs\.\s*([\d,.]+)/i)&.[](1)&.gsub(",", "")&.to_f
          next
        end

        # Match: ... ISIN DATE QTY Rs. X.XX Rs. YYY.YY
        m = line.match(/(.+?)\s+(INE[A-Z0-9]{10})\s+(\d{2}-\d{2}-\d{4})\s+(\d+)\s+Rs\.\s*([\d.]+)\s+Rs\.\s*([\d,.]+)/)
        next unless m

        company = m[1].strip
        isin = m[2]
        ex_date = m[3]
        shares = m[4].to_f
        div_per_share = m[5].to_f
        net_amount = m[6].gsub(",", "").to_f

        dividends << {
          company: company,
          isin: isin,
          ex_date: ex_date,
          shares: shares,
          dividend_per_share: div_per_share,
          net_amount: net_amount
        }
      end

      {
        document_type: "pnl",
        sub_type: "dividend",
        dividends: dividends,
        total_dividend: total || dividends.sum { |d| d[:net_amount] }
      }
    end
  end
end
