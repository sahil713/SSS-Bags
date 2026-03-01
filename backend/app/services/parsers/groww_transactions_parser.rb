# frozen_string_literal: true

# Parses Groww Transactions PDFs: MF, Stocks, Balance Statement
# Extracts: transaction list, opening/closing balance, SIP/redemption details
# Refine when you have sample Groww Transaction PDFs
module Parsers
  class GrowwTransactionsParser
    def self.parse(text, sub_type, _statement)
      transactions = parse_transaction_list(text)
      balance = extract_balance(text) if sub_type == "balance_statement"
      {
        document_type: "transactions",
        sub_type: sub_type,
        transactions: transactions,
        opening_balance: balance&.dig(:opening),
        closing_balance: balance&.dig(:closing)
      }
    end

    def self.parse_transaction_list(text)
      txns = []
      lines = text.split("\n").map(&:strip).reject(&:blank?)
      lines.each_with_index do |line, i|
        if line.match?(/\d{2}[-\/]\d{2}[-\/]\d{2,4}/)
          txn = extract_txn(line)
          txns << txn if txn
        end
      end
      txns
    end

    def self.extract_txn(line)
      parts = line.split(/\s{2,}|\t/)
      return nil if parts.size < 2
      date = parts.find { |p| p.match?(/\d{2}[-\/]\d{2}[-\/]\d{2,4}/) }
      amount = parts.reverse.find { |p| p.match?(/^-?\d+[,.]?\d*$/) }&.to_s&.gsub(",", "")&.to_f
      { date: date, description: parts[1], amount: amount }
    end

    def self.extract_balance(text)
      balance = {}
      text.scan(/(?:opening|opening balance)[:\s]*[₹]?\s*(\d+[,.]?\d*)/i) { |m| balance[:opening] = m[0].to_s.gsub(",", "").to_f }
      text.scan(/(?:closing|closing balance)[:\s]*[₹]?\s*(\d+[,.]?\d*)/i) { |m| balance[:closing] = m[0].to_s.gsub(",", "").to_f }
      balance
    end
  end
end
