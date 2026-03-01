# frozen_string_literal: true

module Api
  module V1
    module Customer
      class InvestmentTaxRecordsController < InvestmentsBaseController
        before_action :set_record, only: %i[show update destroy]

        def index
          records = current_user.investment_tax_records.by_year
          render json: { records: records.map { |r| tax_record_json(r) } }
        end

        def show
          render json: tax_record_json(@record)
        end

        def create
          record = current_user.investment_tax_records.build(tax_record_params)
          if record.save
            render json: tax_record_json(record), status: :created
          else
            render json: { errors: record.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          if @record.update(tax_record_params)
            render json: tax_record_json(@record)
          else
            render json: { errors: @record.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          @record.destroy
          render json: { message: "Tax record deleted" }
        end

        private

        def set_record
          @record = current_user.investment_tax_records.find(params[:id])
        end

        def tax_record_params
          params.permit(:financial_year, :elss_deduction, :stcg_amount, :ltcg_amount, :intraday_pnl, :notes)
        end

        def tax_record_json(r)
          {
            id: r.id,
            financial_year: r.financial_year,
            elss_deduction: r.elss_deduction.to_f,
            stcg_amount: r.stcg_amount.to_f,
            ltcg_amount: r.ltcg_amount.to_f,
            intraday_pnl: r.intraday_pnl.to_f,
            total_capital_gains: r.total_capital_gains.to_f,
            notes: r.notes,
            created_at: r.created_at
          }
        end
      end
    end
  end
end
