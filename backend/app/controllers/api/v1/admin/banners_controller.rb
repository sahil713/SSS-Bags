# frozen_string_literal: true

module Api
  module V1
    module Admin
      class BannersController < BaseController
        before_action :set_banner, only: %i[show update destroy activate]

        def index
          scope = Banner.unscoped.not_deleted
          scope = scope.where(banner_type: params[:banner_type]) if params[:banner_type].present?
          banners = scope.by_priority
          render json: { banners: banners.map { |b| admin_banner_json(b) } }
        end

        def show
          authorize @banner
          render json: admin_banner_json(@banner)
        end

        def create
          banner = Banner.new(banner_params)
          authorize banner
          if banner.save
            banner.image.attach(params[:image]) if params[:image].present?
            render json: admin_banner_json(banner), status: :created
          else
            render json: { errors: banner.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          authorize @banner
          if @banner.update(banner_params)
            @banner.image.attach(params[:image]) if params[:image].present?
            render json: admin_banner_json(@banner)
          else
            render json: { errors: @banner.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          authorize @banner
          @banner.soft_delete
          head :no_content
        end

        def activate
          authorize @banner
          @banner.update!(is_active: !@banner.is_active)
          render json: admin_banner_json(@banner)
        end

        private

        def set_banner
          @banner = Banner.unscoped.not_deleted.find(params[:id])
        end

        def banner_params
          params.permit(
            :title, :subtitle, :description, :button_text, :button_link,
            :banner_type, :is_active, :priority, :background_color, :text_color,
            :start_date, :end_date
          )
        end

        def admin_banner_json(b)
          h = {
            id: b.id,
            title: b.title,
            subtitle: b.subtitle,
            description: b.description,
            button_text: b.button_text,
            button_link: b.button_link,
            banner_type: b.banner_type,
            is_active: b.is_active,
            priority: b.priority,
            background_color: b.background_color,
            text_color: b.text_color,
            start_date: b.start_date,
            end_date: b.end_date,
            created_at: b.created_at,
            updated_at: b.updated_at
          }
          if b.image.attached?
            h[:image_url] = Rails.application.routes.url_helpers.rails_blob_url(b.image, host: request.base_url)
          end
          h
        end
      end
    end
  end
end
