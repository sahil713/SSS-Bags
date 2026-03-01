# frozen_string_literal: true

class PdfPortfolioParser
  # Parses portfolio statement PDFs to extract holdings
  # Format varies by broker (Groww, Zerodha, etc.) - extend as you get sample PDFs
  def self.parse(statement)
    return [] unless statement.file.attached?

    blob = statement.file.blob
    Tempfile.create(["portfolio", ".pdf"]) do |tmp|
      tmp.binmode
      tmp.write(blob.download)
      tmp.rewind
      text = extract_text(tmp.path)
      parse_holdings_from_text(text, statement)
    end
  rescue StandardError => e
    Rails.logger.error("PdfPortfolioParser error: #{e.message}")
    []
  end

  def self.extract_text(file_path)
    require "pdf-reader"
    reader = PDF::Reader.new(file_path)
    reader.pages.map(&:text).join("\n")
  end

  def self.parse_holdings_from_text(text, _statement)
    holdings = []
    lines = text.split("\n").map(&:strip).reject(&:blank?)

    # Common patterns in Indian broker statements:
    # - Symbol/ISIN, Qty, Avg Price, Current Value, P&L
    # - Table with columns
    lines.each_with_index do |line, i|
      # Look for lines that might be holdings (symbol, numbers)
      parts = line.split(/\s{2,}|\t/)
      next if parts.size < 3

      # Try to extract: symbol (alpha), quantity (number), price (decimal)
      symbol = nil
      qty = nil
      avg_price = nil

      parts.each do |p|
        next if p.blank?
        if p.match?(/^[A-Z0-9]{5,15}$/) && !symbol && !p.match?(/^\d+\.?\d*$/)
          symbol = p
        elsif p.match?(/^\d+\.?\d*$/) && qty.nil?
          qty = p.to_f
        elsif p.match?(/^\d+\.?\d*$/) && qty && avg_price.nil?
          avg_price = p.to_f
        end
      end

      if symbol && qty.to_f.positive? && avg_price.to_f.positive?
        holdings << {
          symbol: symbol,
          quantity: qty,
          avg_price: avg_price,
          source: "pdf"
        }
      end
    end

    holdings.uniq { |h| h[:symbol] }
  end
end
