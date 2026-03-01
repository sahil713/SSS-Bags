# frozen_string_literal: true

# Groww PDF document types - maps to Reports section in Groww app
# User uploads these PDFs; we parse and extract relevant data
module GrowwDocumentTypes
  DOCUMENT_TYPES = {
    pnl: {
      label: "Profit & Loss (P&L)",
      sub_types: {
        stocks: "Stocks P&L",
        fno: "F&O P&L",
        dividend: "Dividend Report"
      }
    },
    tax: {
      label: "Tax",
      sub_types: {
        mf_elss: "Mutual Funds - ELSS Statement",
        capital_gains: "Capital Gains",
        stocks: "Stocks Capital Gains",
        mf: "Mutual Funds Capital Gains",
        fno: "F&O"
      }
    },
    gst_invoice: {
      label: "GST Invoice",
      sub_types: {}
    },
    holdings: {
      label: "Holdings",
      sub_types: {
        mf: "Mutual Funds",
        stocks: "Stocks",
        demat: "Demat Report"
      }
    },
    cmr_copy: {
      label: "CMR Copy",
      sub_types: {}
    },
    transactions: {
      label: "Transactions",
      sub_types: {
        mf: "Mutual Funds",
        stocks: "Stocks",
        balance_statement: "Groww Balance Statement"
      }
    }
  }.freeze

  def self.all_type_options
    DOCUMENT_TYPES.flat_map do |type_key, type_config|
      subs = type_config[:sub_types]
      if subs.empty?
        [[type_config[:label], type_key.to_s, nil]]
      else
        subs.map { |sub_key, sub_label| [sub_label, type_key.to_s, sub_key.to_s] }
      end
    end
  end

  def self.as_json
    DOCUMENT_TYPES.transform_keys(&:to_s).transform_values do |v|
      {
        label: v[:label],
        sub_types: v[:sub_types].transform_keys(&:to_s)
      }
    end
  end
end
