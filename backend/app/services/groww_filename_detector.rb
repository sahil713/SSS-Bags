# frozen_string_literal: true

# Detects document_type and document_sub_type from Groww filename
# e.g. Stocks_Holdings_Statement_*.xlsx -> holdings, stocks
module GrowwFilenameDetector
  PATTERNS = [
    [/\AStocks_Holdings_Statement_/i, "holdings", "stocks"],
    [/\AMutual_Funds_\d.*\.(xlsx|pdf)\z/i, "holdings", "mf"],
    [/\ADemat_Report_/i, "holdings", "demat"],
    [/\AStocks_Capital_Gains_Report_/i, "tax", "stocks"],
    [/\AMutual_Funds_Capital_Gains_Report_/i, "tax", "mf"],
    [/\AMutual_Funds_ELSS_Statement_/i, "tax", "mf_elss"],
    [/\AStocks_Order_History_/i, "transactions", "stocks"],
    [/\AMutual_Funds_Order_History_/i, "transactions", "mf"],
    [/\AGroww_Balance_Statement_/i, "transactions", "balance_statement"],
    [/\AStocks_PnL_Report_/i, "pnl", "stocks"],
    [/\A.*Dividend.*Report.*/i, "pnl", "dividend"],
  ].freeze

  def self.detect(filename)
    return nil, nil if filename.blank?
    name = File.basename(filename.to_s)
    PATTERNS.each do |regex, doc_type, sub_type|
      return doc_type, sub_type if regex.match?(name)
    end
    [nil, nil]
  end
end
