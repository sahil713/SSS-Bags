# frozen_string_literal: true

module Api
  module V1
    module Customer
      class OrdersController < BaseController
        before_action :set_order, only: %i[show track]

        def index
          orders = current_user.orders.recent_first
          page = (params[:page] || 1).to_i
          per = (params[:per_page] || 10).to_i.clamp(1, 50)
          total = orders.count
          list = orders.offset((page - 1) * per).limit(per)
          render json: {
            orders: list.map { |o| order_json(o) },
            meta: { total: total, page: page, per_page: per }
          }
        end

        def show
          authorize @order
          render json: order_json(@order, include_items: true)
        end

        def create
          address = current_user.default_address

          Rails.logger.info "address:  #{address.inspect}"

          shipping = address ? address.as_shipping_hash : params.permit(:line1, :line2, :city, :state, :pincode, :phone, :label).to_h
          if shipping.blank? || shipping[:line1].blank?
            return render json: { error: "Shipping address required" }, status: :unprocessable_entity
          end

          order = OrderCreationService.call(current_user, shipping)
          render json: order_json(order, include_items: true), status: :created
        rescue OrderCreationService::InsufficientStock => e
          render json: { error: e.message }, status: :unprocessable_entity
        rescue OrderCreationService::InvalidCart => e
          render json: { error: e.message }, status: :unprocessable_entity
        end

        def track
          authorize @order
          render json: { order_id: @order.id, status: @order.status, payment_status: @order.payment_status, updated_at: @order.updated_at }
        end

        private

        def set_order
          @order = current_user.orders.find(params[:id])
        end

        def order_json(o, include_items: false)
          h = {
            id: o.id,
            total_price: o.total_price,
            shipping_address: o.shipping_address,
            status: o.status,
            payment_status: o.payment_status,
            created_at: o.created_at
          }
          if include_items
            h[:items] = o.order_items.map { |i| { product_id: i.product_id, product_name: i.product.name, quantity: i.quantity, price_at_purchase: i.price_at_purchase, subtotal: i.subtotal } }
          end
          h
        end
      end
    end
  end
end
