# frozen_string_literal: true

module Api
  module V1
    module Admin
      class HomeBannersController < BaseController
        before_action :set_banner, only: %i[update destroy]

        def index
          banners = HomeBanner.order(:position)
          render json: { banners: banners.map { |b| banner_json(b) } }
        end

        def create
          banner = HomeBanner.new(banner_params)
          if banner.save
            banner.image.attach(params[:image]) if params[:image].present?
            render json: banner_json(banner), status: :created
          else
            render json: { errors: banner.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          @banner.assign_attributes(banner_params)
          @banner.image.attach(params[:image]) if params[:image].present?
          if @banner.save
            render json: banner_json(@banner)
          else
            render json: { errors: @banner.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          @banner.destroy
          head :no_content
        end

        private

        def set_banner
          @banner = HomeBanner.find(params[:id])
        end

        def banner_params
          params.permit(:position, :link_url)
        end

        def banner_json(b)
          h = { id: b.id, position: b.position, link_url: b.link_url }
          if b.image.attached?
            h[:image_url] = Rails.application.routes.url_helpers.rails_blob_url(b.image, host: request.base_url)
          end
          h
        end
      end
    end
  end
end
