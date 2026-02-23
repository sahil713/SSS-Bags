# frozen_string_literal: true

module Api
  module V1
    module Admin
      class UsersController < BaseController
        before_action :set_user, only: %i[show update]

        def index
          users = User.order(created_at: :desc)
          page = (params[:page] || 1).to_i
          per = (params[:per_page] || 20).to_i.clamp(1, 100)
          total = users.count
          list = users.offset((page - 1) * per).limit(per)
          render json: {
            users: list.map { |u| user_json(u) },
            meta: { total: total, page: page, per_page: per }
          }
        end

        def show
          authorize @user
          render json: user_json(@user)
        end

        def update
          authorize @user
          if @user.update(user_params)
            render json: user_json(@user)
          else
            render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
          end
        end

        private

        def set_user
          @user = User.find(params[:id])
        end

        def user_params
          params.permit(:name, :email, :phone_number, :role)
        end

        def user_json(u)
          { id: u.id, name: u.name, email: u.email, phone_number: u.phone_number, role: u.role, email_verified: u.email_verified?, phone_verified: u.phone_verified?, active: u.active?, created_at: u.created_at }
        end
      end
    end
  end
end
