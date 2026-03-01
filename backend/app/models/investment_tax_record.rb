# frozen_string_literal: true

class InvestmentTaxRecord < ApplicationRecord
  belongs_to :user

  validates :financial_year, presence: true, uniqueness: { scope: :user_id }

  scope :by_year, -> { order(financial_year: :desc) }

  def total_capital_gains
    stcg_amount.to_d + ltcg_amount.to_d + intraday_pnl.to_d
  end
end
