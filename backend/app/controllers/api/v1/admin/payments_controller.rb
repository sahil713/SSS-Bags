# frozen_string_literal: true

module Api
  module V1
    module Admin
      class PaymentsController < BaseController
        before_action :set_payment, only: [:show]

        def index
          payments = Payment.includes(:order).order(created_at: :desc)
          page = (params[:page] || 1).to_i
          per = (params[:per_page] || 20).to_i.clamp(1, 100)
          total = payments.count
          list = payments.offset((page - 1) * per).limit(per)
          render json: {
            payments: list.map { |p| { id: p.id, order_id: p.order_id, transaction_id: p.transaction_id, status: p.status, created_at: p.created_at } },
            meta: { total: total, page: page, per_page: per }
          }
        end

        def show
          render json: {
            id: @payment.id,
            order_id: @payment.order_id,
            transaction_id: @payment.transaction_id,
            status: @payment.status,
            metadata: @payment.metadata,
            created_at: @payment.created_at,
            updated_at: @payment.updated_at
          }
        end

        private

        def set_payment
          @payment = Payment.find(params[:id])
        end
      end
    end
  end
end
