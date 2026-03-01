# frozen_string_literal: true

module Api
  module V1
    module Customer
      class GrowwConnectionsController < InvestmentsBaseController
        def show
          connection = current_user.groww_connection
          render json: {
            linked: connection&.linked? || false,
            linked_at: connection&.linked_at,
            last_synced_at: connection&.last_synced_at
          }
        end

        def create
          connection = current_user.groww_connection || current_user.build_groww_connection

          connection.assign_attributes(groww_connection_params)
          connection.linked_at = Time.current

          if connection.save
            render json: { message: "Groww account linked successfully", linked: true }
          else
            render json: { errors: connection.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          connection = current_user.groww_connection
          unless connection
            return render json: { error: "No Groww connection found" }, status: :not_found
          end

          connection.unlink!
          render json: { message: "Groww account unlinked" }
        end

        private

        def groww_connection_params
          params.permit(:api_key, :secret, :totp_secret)
        end
      end
    end
  end
end
