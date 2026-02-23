# frozen_string_literal: true

module Api
  module V1
    module Admin
      class ProductsController < BaseController
        before_action :set_product, only: %i[show update destroy toggle_status]

        def index
          scope = Product.unscoped.not_deleted.includes(:category)
          scope = scope.where(category_id: params[:category_id]) if params[:category_id].present?
          scope = scope.where("name ILIKE ?", "%#{Product.sanitize_sql_like(params[:q] || "")}%") if params[:q].present?
          scope = scope.order(created_at: :desc)
          page = (params[:page] || 1).to_i
          per = (params[:per_page] || 20).to_i.clamp(1, 100)
          total = scope.count
          products = scope.offset((page - 1) * per).limit(per)
          render json: {
            products: products.map { |p| admin_product_json(p) },
            meta: { total: total, page: page, per_page: per }
          }
        end

        def show
          authorize @product
          render json: admin_product_json(@product)
        end

        def create
          product = Product.new(product_params)
          authorize product
          if product.save
            attach_images(product) if params[:image_ids].present?
            render json: admin_product_json(product), status: :created
          else
            render json: { errors: product.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          authorize @product
          if @product.update(product_params)
            attach_images(@product) if params[:image_ids].present?
            render json: admin_product_json(@product)
          else
            render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          authorize @product
          @product.soft_delete
          head :no_content
        end

        def toggle_status
          authorize @product
          @product.update!(status: @product.status == "active" ? "inactive" : "active")
          render json: admin_product_json(@product)
        end

        private

        def set_product
          @product = Product.unscoped.not_deleted.find_by!(slug: params[:slug])
        end

        def product_params
          base = params[:product].present? ? params.require(:product) : params
          base.permit(:name, :description, :price, :discount_price, :stock_quantity, :category_id, :slug, :status)
        end

        def like_escape(str)
          str.to_s.gsub(/[%_\\]/) { "\\#{_1}" }
        end

        def attach_images(product)
          return unless params[:image_ids].is_a?(Array)
          params[:image_ids].each do |sid|
            blob = ActiveStorage::Blob.find_signed(sid) rescue next
            product.images.attach(blob) unless product.images.attached?(blob)
          end
        end

        def admin_product_json(p)
          {
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            discount_price: p.discount_price,
            stock_quantity: p.stock_quantity,
            category_id: p.category_id,
            category_name: p.category&.name,
            slug: p.slug,
            status: p.status,
            images: p.images.attached? ? p.images.map { |img| Rails.application.routes.url_helpers.rails_blob_url(img, host: request.base_url) } : [],
            created_at: p.created_at,
            updated_at: p.updated_at
          }
        end
      end
    end
  end
end
