# frozen_string_literal: true

module Api
  module V1
    module Admin
      class DashboardController < BaseController
        def index
          render json: {
            total_users: User.count,
            total_orders: Order.count,
            total_products: Product.not_deleted.count,
            total_revenue: Order.where(payment_status: "success").sum(:total_price) + Order.where(status: %w[confirmed shipped delivered]).sum(:total_price),
            orders_by_status: Order.group(:status).count,
            recent_orders: Order.recent_first.limit(5).map { |o| { id: o.id, user_id: o.user_id, total_price: o.total_price, status: o.status, created_at: o.created_at } }
          }
        end
      end
    end
  end
end
