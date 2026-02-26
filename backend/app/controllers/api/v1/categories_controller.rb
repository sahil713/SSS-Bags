# frozen_string_literal: true

module Api
  module V1
    class CategoriesController < BaseController
      skip_before_action :authenticate_user!, only: %i[index show]

      def index
        categories = Category.order(:name)
        render json: {
          categories: categories.map { |c|
            h = { id: c.id, name: c.name, slug: c.slug }
            if c.respond_to?(:image) && c.image.attached?
              h[:image_url] = rails_blob_url(c.image)
            end
            h
          }
        }
      end

      def show
        category = Category.find_by!(slug: params[:slug])
        render json: { id: category.id, name: category.name, slug: category.slug }
      end

      private

      def rails_blob_url(blob)
        return nil unless blob
        Rails.application.routes.url_helpers.rails_blob_url(blob, host: request.base_url)
      end
    end
  end
end
