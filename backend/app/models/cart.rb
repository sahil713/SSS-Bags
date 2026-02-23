# frozen_string_literal: true

class Cart < ApplicationRecord
  belongs_to :user
  has_many :cart_items, dependent: :destroy
  has_many :products, through: :cart_items

  def total_price
    cart_items.sum { |item| item.product.effective_price * item.quantity }
  end

  def total_items
    cart_items.sum(:quantity)
  end

  def add_item(product_id, quantity = 1)
    item = cart_items.find_or_initialize_by(product_id: product_id)
    item.quantity = (item.quantity + quantity.to_i).clamp(1, item.product.available_quantity)
    item.save!
    item
  end

  def set_quantity(product_id, quantity)
    item = cart_items.find_by!(product_id: product_id)
    q = quantity.to_i.clamp(0, item.product.available_quantity)
    q.zero? ? item.destroy : item.update!(quantity: q)
  end
end
