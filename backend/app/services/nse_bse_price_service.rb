# frozen_string_literal: true

class NseBsePriceService
  # Free NSE/BSE price data - uses public APIs
  # Options: Indian-Stock-Market-API, Tra gradient, nseindia-data
  # TODO: Integrate when backend is ready
  BASE_URL = "https://military-jobye-haiqstudios-14f59639.koyeb.app".freeze

  class << self
    def get_quote(symbol)
      # Stub - integrate with free API
      { symbol: symbol, price: 0, change: 0, change_percent: 0 }
    end

    def get_ohlc(symbol, from_date, to_date)
      # Stub - historical OHLC for indicators and sell timing
      []
    end
  end
end
