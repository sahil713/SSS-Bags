# frozen_string_literal: true

module Api
  module V1
    module Customer
      class CartController < BaseController

        def index
          cart = current_user.cart
          items = cart.cart_items.includes(product: :category)
          render json: {
            items: items.map { |i| cart_item_json(i) },
            total_price: cart.total_price,
            total_items: cart.total_items
          }
        end

        def create
          product = Product.active.not_deleted.find(params[:product_id])
          quantity = (params[:quantity] || 1).to_i.clamp(1, product.available_quantity)
          item = current_user.cart.add_item(product.id, quantity)
          render json: cart_item_json(item), status: :created
        end

        def update
          item = current_user.cart.cart_items.find(params[:id])
          quantity = params[:quantity].to_i.clamp(0, item.product.available_quantity)
          if quantity.zero?
            item.destroy
            render json: { removed: true }
          else
            item.update!(quantity: quantity)
            render json: cart_item_json(item)
          end
        end

        def destroy
          current_user.cart.cart_items.find(params[:id]).destroy
          head :no_content
        end

        def clear
          current_user.cart.cart_items.destroy_all
          render json: { message: "Cart cleared" }
        end

        private

        def cart_item_json(item)
          p = item.product
          {
            id: item.id,
            product_id: p.id,
            product_name: p.name,
            slug: p.slug,
            quantity: item.quantity,
            price: p.effective_price,
            subtotal: item.subtotal,
            image: p.images.attached? ? rails_blob_url(p.images.first) : nil
          }
        end

        def rails_blob_url(blob)
          return nil unless blob
          Rails.application.routes.url_helpers.rails_blob_url(blob, host: request.base_url)
        end
      end
    end
  end
end
