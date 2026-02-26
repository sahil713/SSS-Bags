# frozen_string_literal: true

module Api
  module V1
    class BannersController < BaseController
      skip_before_action :authenticate_user!, only: [:index]

      def index
        type = params[:banner_type].presence
        banners = Banner.active_for_public(type)
        render json: { banners: banners.map { |b| banner_json(b) } }
      end

      private

      def banner_json(b)
        h = {
          id: b.id,
          title: b.title,
          subtitle: b.subtitle,
          description: b.description,
          button_text: b.button_text,
          button_link: b.button_link,
          banner_type: b.banner_type,
          priority: b.priority,
          background_color: b.background_color,
          text_color: b.text_color,
          start_date: b.start_date,
          end_date: b.end_date
        }
        h[:image_url] = rails_blob_url(b.image) if b.image.attached?
        h
      end

      def rails_blob_url(blob)
        return nil unless blob
        Rails.application.routes.url_helpers.rails_blob_url(blob, host: request.base_url)
      end
    end
  end
end
