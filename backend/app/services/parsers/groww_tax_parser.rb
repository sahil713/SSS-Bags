# frozen_string_literal: true

# Parses Groww Tax PDFs: MF/ELSS, Capital Gains, Stocks, F&O
# Extracts: tax summary, capital gains (STCG/LTCG), ELSS deductions
# Refine when you have sample Groww Tax PDFs
module Parsers
  class GrowwTaxParser
    def self.parse(text, sub_type, _statement)
      summary = extract_tax_summary(text)
      gains = extract_capital_gains(text)
      elss = extract_elss(text) if sub_type == "mf_elss"
      {
        document_type: "tax",
        sub_type: sub_type,
        summary: summary,
        capital_gains: gains,
        elss_deductions: elss
      }
    end

    def self.extract_tax_summary(text)
      summary = {}
      text.scan(/(?:short[- ]?term|stcg|stt)[:\s]*[₹]?\s*(\d+[,.]?\d*)/i) { |m| summary[:stcg] = m[0].to_s.gsub(",", "").to_f }
      text.scan(/(?:long[- ]?term|ltcg)[:\s]*[₹]?\s*(\d+[,.]?\d*)/i) { |m| summary[:ltcg] = m[0].to_s.gsub(",", "").to_f }
      text.scan(/(?:total|capital gains)[:\s]*[₹]?\s*(\d+[,.]?\d*)/i) { |m| summary[:total] ||= m[0].to_s.gsub(",", "").to_f }
      summary
    end

    def self.extract_capital_gains(text)
      gains = []
      lines = text.split("\n").map(&:strip)
      lines.each do |line|
        next unless line.match?(/[A-Z][A-Z0-9]{4,14}|[A-Z]{2}[A-Z0-9]{10}/)
        parts = line.split(/\s{2,}|\t/)
        next if parts.size < 3
        gains << { script: parts[0], amount: parts[-1].to_s.gsub(",", "").to_f } if parts[-1].to_s.match?(/^\d+[,.]?\d*$/)
      end
      gains
    end

    def self.extract_elss(text)
      elss = []
      text.scan(/([A-Za-z0-9\s]+(?:ELSS|Tax Saver)[A-Za-z0-9\s]*)[:\s]*[₹]?\s*(\d+[,.]?\d*)/i) do |name, amount|
        elss << { fund: name.strip, amount: amount.to_s.gsub(",", "").to_f }
      end
      elss
    end
  end
end
