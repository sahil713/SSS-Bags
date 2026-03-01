# frozen_string_literal: true

module Api
  module V1
    module Customer
      class HoldingsController < InvestmentsBaseController
        before_action :set_holding, only: %i[show update destroy]

        def index
          holdings = current_user.holdings
          totals = compute_totals(holdings)
          render json: {
            holdings: holdings.map { |h| holding_json(h) },
            total_value: totals[:total_value],
            total_pnl: totals[:total_pnl],
            total_pnl_percent: totals[:total_pnl_percent]
          }
        end

        def show
          render json: holding_json(@holding)
        end

        def create
          holding = current_user.holdings.build(holding_params)
          if holding.save
            render json: holding_json(holding), status: :created
          else
            render json: { errors: holding.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          if @holding.update(holding_params)
            render json: holding_json(@holding)
          else
            render json: { errors: @holding.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          @holding.destroy
          render json: { message: "Holding deleted" }
        end

        private

        def set_holding
          @holding = current_user.holdings.find(params[:id])
        end

        def holding_params
          params.permit(:symbol, :isin, :name, :quantity, :avg_price, :current_price, :holding_type, :notes)
        end

        def holding_json(h)
          {
            id: h.id,
            symbol: h.symbol,
            isin: h.isin,
            name: h.name,
            quantity: h.quantity.to_f,
            avg_price: h.avg_price.to_f,
            current_price: h.current_price&.to_f,
            value: h.current_value.to_f,
            pnl: h.pnl.to_f,
            pnl_percent: h.pnl_percent,
            holding_type: h.holding_type,
            source: h.source,
            notes: h.notes
          }
        end

        def compute_totals(holdings)
          total_value = holdings.sum(&:current_value)
          total_cost = holdings.sum(&:cost_basis)
          total_pnl = total_value - total_cost
          total_pnl_percent = total_cost.positive? ? (total_pnl / total_cost * 100) : 0
          {
            total_value: total_value.round(2),
            total_pnl: total_pnl.round(2),
            total_pnl_percent: total_pnl_percent.round(2)
          }
        end
      end
    end
  end
end
