# frozen_string_literal: true

module Api
  module V1
    module Admin
      class CategoriesController < BaseController
        before_action :set_category, only: %i[show update destroy]

        def index
          categories = Category.order(:name)
          render json: { categories: categories.map { |c| { id: c.id, name: c.name, slug: c.slug } } }
        end

        def show
          authorize @category
          render json: { id: @category.id, name: @category.name, slug: @category.slug }
        end

        def create
          category = Category.new(category_params)
          authorize category
          if category.save
            render json: { id: category.id, name: category.name, slug: category.slug }, status: :created
          else
            render json: { errors: category.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          authorize @category
          if @category.update(category_params)
            render json: { id: @category.id, name: @category.name, slug: @category.slug }
          else
            render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          authorize @category
          @category.destroy
          head :no_content
        end

        private

        def set_category
          @category = Category.find_by!(slug: params[:slug])
        end

        def category_params
          params.permit(:name, :slug)
        end
      end
    end
  end
end
