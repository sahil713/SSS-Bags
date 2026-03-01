# frozen_string_literal: true

# Main dispatcher for Groww document parsing (PDF + XLSX).
# Detects file type and routes to the appropriate parser.
class GrowwFileParser
  def self.parse(statement)
    return {} unless statement.file.attached?

    blob = statement.file.blob
    ext = File.extname(blob.filename.to_s).downcase
    doc_type = (statement.document_type || "holdings").to_s
    sub_type = (statement.document_sub_type || "stocks").to_s

    if ext == ".xlsx"
      GrowwXlsxParser.parse(statement, doc_type, sub_type)
    else
      GrowwPdfParser.parse(statement)
    end
  end
end
