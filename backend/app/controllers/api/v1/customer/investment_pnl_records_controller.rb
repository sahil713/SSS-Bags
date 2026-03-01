# frozen_string_literal: true

module Api
  module V1
    module Customer
      class InvestmentPnlRecordsController < InvestmentsBaseController
        before_action :set_record, only: %i[show update destroy]

        def index
          records = current_user.investment_pnl_records.by_period
          records = records.where(period_type: params[:period_type]) if params[:period_type].present?
          records = records.limit(params[:limit] || 50)
          render json: { records: records.map { |r| pnl_record_json(r) } }
        end

        def show
          render json: pnl_record_json(@record)
        end

        def create
          record = current_user.investment_pnl_records.build(pnl_record_params)
          if record.save
            render json: pnl_record_json(record), status: :created
          else
            render json: { errors: record.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          if @record.update(pnl_record_params)
            render json: pnl_record_json(@record)
          else
            render json: { errors: @record.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          @record.destroy
          render json: { message: "P&L record deleted" }
        end

        private

        def set_record
          @record = current_user.investment_pnl_records.find(params[:id])
        end

        def pnl_record_params
          params.permit(:period_type, :period_start, :period_end, :realised_pnl, :unrealised_pnl,
                         :dividend_income, :intraday_pnl, :fno_pnl, :total_charges, :notes)
        end

        def pnl_record_json(r)
          {
            id: r.id,
            period_type: r.period_type,
            period_start: r.period_start,
            period_end: r.period_end,
            realised_pnl: r.realised_pnl.to_f,
            unrealised_pnl: r.unrealised_pnl.to_f,
            dividend_income: r.dividend_income.to_f,
            intraday_pnl: r.intraday_pnl.to_f,
            fno_pnl: r.fno_pnl.to_f,
            total_charges: r.total_charges.to_f,
            total_pnl: r.total_pnl.to_f,
            notes: r.notes,
            created_at: r.created_at
          }
        end
      end
    end
  end
end
