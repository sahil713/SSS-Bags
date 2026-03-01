# frozen_string_literal: true

module Api
  module V1
    module Customer
      class InvestmentStrategiesController < InvestmentsBaseController
        before_action :set_strategy, only: %i[show update destroy]

        def index
          strategies = current_user.investment_strategies
          render json: { strategies: strategies.map { |s| strategy_json(s) } }
        end

        def show
          render json: strategy_json(@strategy)
        end

        def create
          strategy = current_user.investment_strategies.build(strategy_params)
          if strategy.save
            render json: strategy_json(strategy), status: :created
          else
            render json: { errors: strategy.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          if @strategy.update(strategy_params)
            render json: strategy_json(@strategy)
          else
            render json: { errors: @strategy.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          @strategy.destroy
          render json: { message: "Strategy deleted" }
        end

        private

        def set_strategy
          @strategy = current_user.investment_strategies.find(params[:id])
        end

        def strategy_params
          params.permit(:name, :description, :strategy_type, rules: {})
        end

        def strategy_json(s)
          {
            id: s.id,
            name: s.name,
            description: s.description,
            strategy_type: s.strategy_type,
            rules: s.rules
          }
        end
      end
    end
  end
end