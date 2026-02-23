# frozen_string_literal: true

class OrderCreationService
  class InsufficientStock < StandardError; end
  class InvalidCart < StandardError; end

  def self.call(user, shipping_address)
    new(user, shipping_address).call
  end

  def initialize(user, shipping_address)
    @user = user
    @shipping_address = shipping_address
  end

  def call
    Order.transaction do
      cart = @user.cart
      raise InvalidCart, "Cart is empty" if cart.cart_items.empty?

      cart.cart_items.each do |item|
        raise InsufficientStock, "#{item.product.name} has only #{item.product.stock_quantity} in stock" if item.quantity > item.product.stock_quantity
      end

      total = cart.cart_items.sum { |item| item.product.effective_price * item.quantity }
      order = Order.create!(
        user_id: @user.id,
        total_price: total,
        shipping_address: @shipping_address,
        status: "pending",
        payment_status: "pending"
      )

      cart.cart_items.each do |item|
        OrderItem.create!(
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_purchase: item.product.effective_price
        )
        item.product.decrement!(:stock_quantity, item.quantity)
      end

      cart.cart_items.destroy_all
      Payment.create!(order_id: order.id, status: "initiated") # placeholder for future gateway

      order
    end
  end
end
