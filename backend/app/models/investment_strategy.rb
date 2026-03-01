# frozen_string_literal: true

class InvestmentStrategy < ApplicationRecord
  belongs_to :user

  STRATEGY_TYPES = %w[rule_based value growth dividend].freeze

  validates :name, presence: true
  validates :strategy_type, inclusion: { in: STRATEGY_TYPES }
end
