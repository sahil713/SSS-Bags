# frozen_string_literal: true

module Api
  module V1
    module Customer
      class OrdersController < BaseController
        before_action :set_order, only: %i[show track cancel]

        def index
          orders = current_user.orders.recent_first.includes(order_items: :product)
          page = (params[:page] || 1).to_i
          per = (params[:per_page] || 10).to_i.clamp(1, 50)
          total = orders.count
          list = orders.offset((page - 1) * per).limit(per)
          render json: {
            orders: list.map { |o| order_json(o, include_items: true) },
            meta: { total: total, page: page, per_page: per }
          }
        end

        def show
          authorize @order
          render json: order_json(@order, include_items: true)
        end

        def cancel
          authorize @order
          if @order.status != "pending"
            return render json: { error: "Only pending orders can be cancelled" }, status: :unprocessable_entity
          end
          @order.update!(status: "cancelled")
          render json: order_json(@order, include_items: true)
        end

        def create
          address = if params[:address_id].present?
            current_user.addresses.find_by(id: params[:address_id])
          else
            current_user.default_address
          end

          shipping = address ? address.as_shipping_hash : params.permit(:line1, :line2, :city, :state, :pincode, :phone, :label).to_h
          if shipping.blank? || shipping[:line1].blank?
            return render json: { error: "Please select a delivery address" }, status: :unprocessable_entity
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
            order_number: "ORD-#{o.id}",
            total_price: o.total_price,
            shipping_address: o.shipping_address,
            status: o.status,
            payment_status: o.payment_status,
            created_at: o.created_at
          }
          if include_items
            h[:items] = o.order_items.includes(:product).map { |i| order_item_json(i) }
          end
          h
        end

        def order_item_json(item)
          h = {
            id: item.id,
            product_id: item.product_id,
            product_name: item.product.name,
            product_slug: item.product.slug,
            quantity: item.quantity,
            price_at_purchase: item.price_at_purchase,
            subtotal: item.subtotal
          }
          if item.product.images.attached?
            h[:product_image_url] = rails_blob_url(item.product.images.first)
          end
          h
        end

        def rails_blob_url(blob)
          return nil unless blob
          Rails.application.routes.url_helpers.rails_blob_url(blob, host: request.base_url)
        end
      end
    end
  end
end
