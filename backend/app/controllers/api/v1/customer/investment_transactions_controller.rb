# frozen_string_literal: true

module Api
  module V1
    module Customer
      class InvestmentTransactionsController < InvestmentsBaseController
        before_action :set_transaction, only: %i[show update destroy]

        def index
          transactions = current_user.investment_transactions.by_date
          transactions = transactions.where(asset_type: params[:asset_type]) if params[:asset_type].present?
          transactions = transactions.where(symbol: params[:symbol]) if params[:symbol].present?
          transactions = transactions.limit(params[:limit] || 100)
          render json: { transactions: transactions.map { |t| transaction_json(t) } }
        end

        def show
          render json: transaction_json(@transaction)
        end

        def create
          transaction = current_user.investment_transactions.build(transaction_params)
          if transaction.save
            render json: transaction_json(transaction), status: :created
          else
            render json: { errors: transaction.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          if @transaction.update(transaction_params)
            render json: transaction_json(@transaction)
          else
            render json: { errors: @transaction.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          @transaction.destroy
          render json: { message: "Transaction deleted" }
        end

        private

        def set_transaction
          @transaction = current_user.investment_transactions.find(params[:id])
        end

        def transaction_params
          params.permit(:transaction_type, :asset_type, :symbol, :name, :quantity, :price, :amount, :transaction_date, :notes)
        end

        def transaction_json(t)
          {
            id: t.id,
            transaction_type: t.transaction_type,
            asset_type: t.asset_type,
            symbol: t.symbol,
            name: t.name,
            quantity: t.quantity.to_f,
            price: t.price.to_f,
            amount: t.amount.to_f,
            transaction_date: t.transaction_date,
            notes: t.notes,
            created_at: t.created_at
          }
        end
      end
    end
  end
end
