# frozen_string_literal: true

class RecommendationService
  # Combines rule-based signals + AI (Phase 4)
  SELL_TIMING_OPTIONS = [1, 5, 15, 30, 90, 180, 365].freeze # days

  class << self
    def rule_based_signals(symbol, financials = {})
      # PE < 20, ROE > 15%, debt/equity < 1, etc.
      {
        signal: "hold",
        strength: 0,
        reasons: []
      }
    end

    def sell_timing_suggestion(symbol, holding, horizon_days)
      # Use price history + indicators
      {
        suggestion: "hold",
        horizon_days: horizon_days,
        confidence: 0
      }
    end
  end
end
