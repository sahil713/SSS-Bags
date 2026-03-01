# frozen_string_literal: true

# Parses Groww Holdings PDFs: Mutual Funds, Stocks, Demat Report
# Extracts: symbol, isin, name, quantity, avg_price, nav (for MF)
# Refine patterns when you have sample Groww PDFs
module Parsers
  class GrowwHoldingsParser
    def self.parse(text, sub_type, _statement)
      holdings = parse_holdings_from_text(text, sub_type)
      { holdings: holdings }
    end

    def self.parse_holdings_from_text(text, sub_type)
      lines = text.split("\n").map(&:strip).reject(&:blank?)
      holdings = []
      in_holdings_section = false

      lines.each_with_index do |line, i|
        # Groww typically has headers like "Holdings", "Stock", "Mutual Fund", etc.
        in_holdings_section = true if line.match?(/holdings?|stock|mutual fund|demat|script|symbol/i)
        next unless in_holdings_section

        parts = line.split(/\s{2,}|\t/)
        next if parts.size < 2

        record = extract_holding_record(parts, sub_type)
        holdings << record if record
      end

      # Fallback: scan for symbol-like + quantity + price patterns
      if holdings.empty?
        holdings = fallback_parse(text, sub_type)
      end

      holdings.uniq { |h| [h[:symbol], h[:isin]].compact.join }
    end

    def self.extract_holding_record(parts, sub_type)
      symbol = nil
      isin = nil
      name = nil
      qty = nil
      avg_price = nil
      nav = nil

      parts.each do |p|
        next if p.blank?
        # ISIN: 12 alphanumeric
        if p.match?(/^[A-Z]{2}[A-Z0-9]{10}$/)
          isin = p
        # Symbol: 2-20 chars, often uppercase
        elsif p.match?(/^[A-Z0-9]{2,20}$/) && !p.match?(/^\d+\.?\d*$/) && symbol.nil?
          symbol = p
        # Quantity
        elsif p.match?(/^\d+\.?\d*$/) && qty.nil?
          qty = p.to_f
        # Price/NAV
        elsif p.match?(/^\d+\.?\d*$/) && qty && (avg_price.nil? || nav.nil?)
          avg_price ||= p.to_f
          nav ||= p.to_f if sub_type == "mf"
        end
      end

      return nil unless symbol || isin
      return nil unless qty.to_f.positive?

      price = (avg_price || nav || 0).to_f
      price = 1.0 if price.zero? && sub_type == "mf" # MF may not show NAV in some formats

      {
        symbol: symbol || isin,
        isin: isin,
        name: name,
        quantity: qty.to_f,
        avg_price: price,
        holding_type: sub_type == "mf" ? "mf" : "equity",
        source: "pdf"
      }
    end

    def self.fallback_parse(text, sub_type)
      holdings = []
      # Pattern: symbol (5-15 chars) followed by numbers
      text.scan(/([A-Z][A-Z0-9]{4,14})\s+(\d+\.?\d*)\s+(\d+\.?\d*)/) do |sym, qty, price|
        next if qty.to_f <= 0 || price.to_f <= 0
        holdings << {
          symbol: sym,
          quantity: qty.to_f,
          avg_price: price.to_f,
          holding_type: sub_type == "mf" ? "mf" : "equity",
          source: "pdf"
        }
      end
      holdings
    end
  end
end
