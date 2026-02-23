# frozen_string_literal: true

module Api
  module V1
    class ProductsController < BaseController
      skip_before_action :authenticate_user!, only: %i[index show search]
      before_action :set_product, only: [:show]

      def index
        scope = Product.active.not_deleted.includes(:category)
        scope = scope.where(category_id: params[:category_id]) if params[:category_id].present?
        scope = scope.where("name ILIKE ?", "%#{like_escape(params[:q])}%") if params[:q].present?
        scope = scope.order(created_at: :desc)
        scope = scope.order(params[:sort] => (params[:order] == "asc" ? :asc : :desc)) if params[:sort].in?(%w[name price created_at])
        page = (params[:page] || 1).to_i
        per = (params[:per_page] || 20).to_i.clamp(1, 100)
        total = scope.count
        products = scope.offset((page - 1) * per).limit(per)
        render json: {
          products: products.map { |p| product_json(p) },
          meta: { total: total, page: page, per_page: per }
        }
      end

      def show
        render json: product_json(@product)
      end

      def search
        scope = Product.active.not_deleted
        scope = scope.where("name ILIKE ? OR description ILIKE ?", "%#{like_escape(params[:q])}%", "%#{like_escape(params[:q])}%") if params[:q].present?
        products = scope.limit(20)
        render json: { products: products.map { |p| product_json(p) } }
      end

      private

      def set_product
        @product = Product.not_deleted.by_slug(params[:slug])
      end

      def like_escape(str)
        str.to_s.gsub(/[%_\\]/) { "\\#{_1}" }
      end

      def blob_url(blob)
        return nil unless blob
        Rails.application.routes.url_helpers.rails_blob_url(blob, host: request.base_url)
      end

      def product_json(p)
        {
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          discount_price: p.discount_price,
          effective_price: p.effective_price,
          stock_quantity: p.stock_quantity,
          category_id: p.category_id,
          category_name: p.category&.name,
          slug: p.slug,
          status: p.status,
          images: p.images.attached? ? p.images.map { |img| blob_url(img) } : []
        }
      end
    end
  end
end
