# frozen_string_literal: true

module Api
  module V1
    module Webhooks
      class PaymentsController < BaseController
        skip_before_action :authenticate_user!, raise: false

        def create
          result = PaymentWebhookService.process(request.raw_post, request.headers["X-Webhook-Signature"])
          render json: result, status: :ok
        end
      end
    end
  end
end
