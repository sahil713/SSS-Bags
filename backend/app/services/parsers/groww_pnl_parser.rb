# frozen_string_literal: true

# Parses Groww P&L PDFs: Stocks, F&O, Dividend
# Extracts: transactions (buy/sell), realized_pnl, dividend_income
# Refine when you have sample Groww P&L PDFs
module Parsers
  class GrowwPnlParser
    def self.parse(text, sub_type, _statement)
      transactions = parse_transactions(text, sub_type)
      totals = extract_totals(text)
      {
        document_type: "pnl",
        sub_type: sub_type,
        transactions: transactions,
        total_realized_pnl: totals[:realized_pnl],
        total_dividend: totals[:dividend],
        summary: totals
      }
    end

    def self.parse_transactions(text, _sub_type)
      transactions = []
      lines = text.split("\n").map(&:strip).reject(&:blank?)

      lines.each_with_index do |line, i|
        # Look for date + script + buy/sell + qty + price + pnl
        if line.match?(/\d{2}[-\/]\d{2}[-\/]\d{2,4}|\d{4}[-\/]\d{2}[-\/]\d{2}/)
          txn = extract_transaction(line, lines[i + 1])
          transactions << txn if txn
        end
      end

      transactions
    end

    def self.extract_transaction(line, _next_line)
      parts = line.split(/\s{2,}|\t/)
      return nil if parts.size < 3

      date = nil
      script = nil
      side = nil
      qty = nil
      price = nil
      pnl = nil

      parts.each do |p|
        if p.match?(/\d{2}[-\/]\d{2}[-\/]\d{2,4}/)
          date = p
        elsif p.match?(/^(buy|sell|bought|sold)$/i)
          side = p.downcase
        elsif p.match?(/^[A-Z][A-Z0-9]{4,14}$/)
          script = p unless script
        elsif p.match?(/^-?\d+\.?\d*$/)
          num = p.to_f
          qty ||= num if num == num.to_i
          price ||= num if num > 1 && num < 1_000_000
          pnl ||= num if num.abs < 1_000_000 && (qty || price)
        end
      end

      return nil unless date && script

      { date: date, script: script, side: side, quantity: qty, price: price, pnl: pnl }
    end

    def self.extract_totals(text)
      totals = { realized_pnl: nil, dividend: nil }
      text.scan(/(?:total|realized|pnl|profit|loss)[:\s]*[₹]?\s*(-?\d+[,.]?\d*)/i) do |m|
        totals[:realized_pnl] ||= m[0].to_s.gsub(",", "").to_f
      end
      text.scan(/(?:dividend|income)[:\s]*[₹]?\s*(\d+[,.]?\d*)/i) do |m|
        totals[:dividend] ||= m[0].to_s.gsub(",", "").to_f
      end
      totals
    end
  end
end
