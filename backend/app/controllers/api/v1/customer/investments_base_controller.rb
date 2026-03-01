# frozen_string_literal: true

module Api
  module V1
    module Customer
      class InvestmentsBaseController < BaseController
        before_action :require_email_verified

        private

        def require_email_verified
          return if current_user&.email_verified?

          render json: { error: "Email verification required to access investments" }, status: :forbidden
        end
      end
    end
  end
end
