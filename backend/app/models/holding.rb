# frozen_string_literal: true

class Holding < ApplicationRecord
  belongs_to :user

  HOLDING_TYPES = %w[equity mf].freeze
  SOURCES = %w[manual pdf].freeze

  validates :symbol, :quantity, :avg_price, presence: true
  validates :quantity, numericality: { greater_than: 0 }
  validates :avg_price, numericality: { greater_than_or_equal_to: 0 }
  validates :holding_type, inclusion: { in: HOLDING_TYPES }
  validates :source, inclusion: { in: SOURCES }

  def current_value
    (current_price || avg_price).to_d * quantity
  end

  def cost_basis
    avg_price * quantity
  end

  def pnl
    current_value - cost_basis
  end

  def pnl_percent
    return 0 if cost_basis.zero?
    (pnl / cost_basis * 100).round(2)
  end
end
