# frozen_string_literal: true

# Main dispatcher for Groww PDF parsing.
# Routes to the appropriate parser based on document_type and document_sub_type.
# Parsers extract structured data; holdings-type docs create/update Holding records.
class GrowwPdfParser
  def self.parse(statement)
    return {} unless statement.file.attached?

    text = extract_text(statement)
    doc_type = (statement.document_type || "holdings").to_s
    sub_type = (statement.document_sub_type || "stocks").to_s

    case doc_type
    when "holdings"
      Parsers::GrowwHoldingsParser.parse(text, sub_type, statement)
    when "pnl"
      sub_type == "dividend" ? Parsers::GrowwDividendParser.parse(text, sub_type, statement) : Parsers::GrowwPnlParser.parse(text, sub_type, statement)
    when "tax"
      Parsers::GrowwTaxParser.parse(text, sub_type, statement)
    when "transactions"
      Parsers::GrowwTransactionsParser.parse(text, sub_type, statement)
    when "gst_invoice", "cmr_copy"
      Parsers::GrowwGenericParser.parse(text, doc_type, statement)
    else
      Parsers::GrowwHoldingsParser.parse(text, sub_type, statement)
    end
  end

  def self.extract_text(statement)
    blob = statement.file.blob
    Tempfile.create(["groww", ".pdf"]) do |tmp|
      tmp.binmode
      tmp.write(blob.download)
      tmp.rewind
      require "pdf-reader"
      reader = PDF::Reader.new(tmp.path)
      reader.pages.map(&:text).join("\n")
    end
  rescue StandardError => e
    Rails.logger.error("GrowwPdfParser extract_text error: #{e.message}")
    ""
  end
end
