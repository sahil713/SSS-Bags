# frozen_string_literal: true

class Order < ApplicationRecord
  STATUSES = %w[pending confirmed shipped delivered cancelled].freeze
  PAYMENT_STATUSES = %w[pending initiated success failed].freeze

  belongs_to :user
  has_many :order_items, dependent: :destroy
  has_many :products, through: :order_items
  has_many :payments, dependent: :destroy

  validates :total_price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :shipping_address, presence: true
  validates :status, inclusion: { in: STATUSES }
  validates :payment_status, inclusion: { in: PAYMENT_STATUSES }

  scope :recent_first, -> { order(created_at: :desc) }
end
