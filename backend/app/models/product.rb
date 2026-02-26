# frozen_string_literal: true

class Product < ApplicationRecord
  include SoftDeletable

  STATUSES = %w[active inactive].freeze

  belongs_to :category
  has_many_attached :images do |attachable|
    attachable.variant :thumb, resize_to_limit: [200, 200]
    attachable.variant :medium, resize_to_limit: [600, 600]
    attachable.variant :large, resize_to_limit: [1200, 1200]
  end
  has_many :cart_items, dependent: :destroy
  has_many :order_items, dependent: :nullify

  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :discount_price, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :stock_quantity, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :slug, presence: true, uniqueness: true
  validates :status, inclusion: { in: STATUSES }

  scope :active, -> { where(status: "active") }
  scope :featured, -> { where(featured: true) }
  scope :in_stock, -> { where("stock_quantity > 0") }

  before_validation :generate_slug, on: :create

  def self.by_slug(slug)
    find_by!(slug: slug)
  end

  def effective_price
    discount_price.present? && discount_price < price ? discount_price : price
  end

  def in_stock?
    stock_quantity.positive?
  end

  def available_quantity
    stock_quantity
  end

  private

  def generate_slug
    return if slug.present?
    base = name.parameterize
    self.slug = base
    n = 1
    while Product.exists?(slug: slug)
      self.slug = "#{base}-#{n}"
      n += 1
    end
  end
end
