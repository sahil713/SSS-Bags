# frozen_string_literal: true

module Api
  module V1
    class CategoriesController < BaseController
      skip_before_action :authenticate_user!, only: %i[index show]

      def index
        categories = Category.order(:name)
        render json: { categories: categories.map { |c| { id: c.id, name: c.name, slug: c.slug } } }
      end

      def show
        category = Category.find_by!(slug: params[:slug])
        render json: { id: category.id, name: category.name, slug: category.slug }
      end
    end
  end
end
