# frozen_string_literal: true

class InvestmentTransaction < ApplicationRecord
  belongs_to :user

  TRANSACTION_TYPES = %w[buy sell].freeze
  ASSET_TYPES = %w[stocks mf].freeze

  validates :transaction_type, inclusion: { in: TRANSACTION_TYPES }
  validates :asset_type, inclusion: { in: ASSET_TYPES }
  validates :symbol, :quantity, :price, :amount, :transaction_date, presence: true
  validates :quantity, numericality: { greater_than: 0 }
  validates :price, numericality: { greater_than_or_equal_to: 0 }
  validates :amount, numericality: { greater_than_or_equal_to: 0 }

  scope :by_date, -> { order(transaction_date: :desc) }
  scope :buys, -> { where(transaction_type: "buy") }
  scope :sells, -> { where(transaction_type: "sell") }
  scope :stocks, -> { where(asset_type: "stocks") }
  scope :mf, -> { where(asset_type: "mf") }
end
