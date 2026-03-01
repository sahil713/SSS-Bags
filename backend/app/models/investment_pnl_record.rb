# frozen_string_literal: true

class InvestmentPnlRecord < ApplicationRecord
  belongs_to :user

  PERIOD_TYPES = %w[monthly yearly].freeze

  validates :period_type, inclusion: { in: PERIOD_TYPES }
  validates :period_start, :period_end, presence: true
  validate :period_end_after_start

  scope :by_period, -> { order(period_start: :desc) }
  scope :monthly, -> { where(period_type: "monthly") }
  scope :yearly, -> { where(period_type: "yearly") }

  def total_pnl
    (realised_pnl.to_d + unrealised_pnl.to_d + dividend_income.to_d + intraday_pnl.to_d + fno_pnl.to_d) - total_charges.to_d
  end

  private

  def period_end_after_start
    return if period_start.blank? || period_end.blank?
    errors.add(:period_end, "must be after period start") if period_end < period_start
  end
end
