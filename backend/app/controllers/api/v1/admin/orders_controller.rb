# frozen_string_literal: true

module Api
  module V1
    module Admin
      class OrdersController < BaseController
        before_action :set_order, only: %i[show update update_status]

        def index
          scope = Order.includes(:user).recent_first
          scope = scope.where(status: params[:status]) if params[:status].present?
          scope = scope.where(user_id: params[:user_id]) if params[:user_id].present?
          page = (params[:page] || 1).to_i
          per = (params[:per_page] || 20).to_i.clamp(1, 100)
          total = scope.count
          orders = scope.offset((page - 1) * per).limit(per)
          render json: {
            orders: orders.map { |o| order_json(o) },
            meta: { total: total, page: page, per_page: per }
          }
        end

        def show
          authorize @order
          render json: order_json(@order, include_items: true)
        end

        def update
          authorize @order
          if @order.update(order_params)
            render json: order_json(@order, include_items: true)
          else
            render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update_status
          authorize @order
          status = params[:status]
          unless Order::STATUSES.include?(status)
            return render json: { error: "Invalid status" }, status: :unprocessable_entity
          end
          @order.update!(status: status)
          render json: order_json(@order, include_items: true)
        end

        private

        def set_order
          @order = Order.find(params[:id])
        end

        def order_params
          params.permit(:shipping_address, :payment_status)
        end

        def order_json(o, include_items: false)
          h = {
            id: o.id,
            user_id: o.user_id,
            user_email: o.user&.email,
            total_price: o.total_price,
            shipping_address: o.shipping_address,
            status: o.status,
            payment_status: o.payment_status,
            created_at: o.created_at,
            updated_at: o.updated_at
          }
          if include_items
            h[:items] = o.order_items.map { |i| { id: i.id, product_id: i.product_id, product_name: i.product.name, quantity: i.quantity, price_at_purchase: i.price_at_purchase, subtotal: i.subtotal } }
          end
          h
        end
      end
    end
  end
end
