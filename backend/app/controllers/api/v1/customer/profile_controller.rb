# frozen_string_literal: true

module Api
  module V1
    module Customer
      class ProfileController < BaseController
        def show
          render json: user_json(current_user)
        end

        def update
          if current_user.update(profile_params)
            render json: user_json(current_user)
          else
            render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
          end
        end

        private

        def profile_params
          params.permit(:name, :phone_number, :avatar)
        end

        def user_json(u)
          {
            id: u.id,
            name: u.name,
            email: u.email,
            phone_number: u.phone_number,
            avatar_url: u.avatar.attached? ? rails_blob_url(u.avatar) : nil,
            role: u.role,
            email_verified: u.email_verified?,
            phone_verified: u.phone_verified?,
            active: u.active?
          }
        end

        def rails_blob_url(blob)
          Rails.application.routes.url_helpers.rails_blob_url(blob, host: request.base_url)
        end
      end
    end
  end
end
