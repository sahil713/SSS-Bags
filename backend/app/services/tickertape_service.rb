# frozen_string_literal: true

class TickertapeService
  # Tickertape API: https://api.tickertape.in
  # Financials, peer comparison, scorecards
  BASE_URL = "https://api.tickertape.in".freeze

  class << self
    def get_stock_details(symbol)
      # Stub - integrate with Tickertape API
      {}
    end

    def get_financials(symbol)
      # Stub
      {}
    end
  end
end
