# frozen_string_literal: true

# Parses generic Groww PDFs: GST Invoice, CMR Copy
# Extracts: invoice number, date, amount, key fields
# Refine when you have sample PDFs
module Parsers
  class GrowwGenericParser
    def self.parse(text, doc_type, _statement)
      data = {}
      data[:invoice_number] = text[/invoice\s*#?\s*:?\s*([A-Z0-9-]+)/i]&.match(1)&.to_s
      data[:date] = text[/\d{2}[-\/]\d{2}[-\/]\d{2,4}/]
      data[:amount] = text[/[₹]?\s*(\d+[,.]?\d*)/]&.to_s&.gsub(/[₹,\s]/, "")&.to_f
      data[:raw_snippets] = text.split("\n").map(&:strip).reject(&:blank?).first(50)
      {
        document_type: doc_type,
        extracted: data
      }
    end
  end
end
