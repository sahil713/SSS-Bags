# frozen_string_literal: true

module Api
  module V1
    module Customer
      class PortfolioSnapshotsController < InvestmentsBaseController
        before_action :set_snapshot, only: %i[show update destroy]

        def index
          snapshots = current_user.portfolio_snapshots.by_date.limit(params[:limit] || 50)
          render json: { snapshots: snapshots.map { |s| snapshot_json(s) } }
        end

        def show
          render json: snapshot_json(@snapshot)
        end

        def create
          snapshot = current_user.portfolio_snapshots.build(snapshot_params)
          snapshot.synced_at ||= Time.current
          if snapshot.save
            render json: snapshot_json(snapshot), status: :created
          else
            render json: { errors: snapshot.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          if @snapshot.update(snapshot_params)
            render json: snapshot_json(@snapshot)
          else
            render json: { errors: @snapshot.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          @snapshot.destroy
          render json: { message: "Snapshot deleted" }
        end

        private

        def set_snapshot
          @snapshot = current_user.portfolio_snapshots.find(params[:id])
        end

        def snapshot_params
          params.permit(:total_value, :total_pnl, :total_pnl_percent, :snapshot_date, :holdings)
        end

        def snapshot_json(s)
          {
            id: s.id,
            total_value: s.total_value.to_f,
            total_pnl: s.total_pnl.to_f,
            total_pnl_percent: s.total_pnl_percent.to_f,
            synced_at: s.synced_at,
            snapshot_date: s.snapshot_date,
            chart_date: s.chart_date,
            created_at: s.created_at
          }
        end
      end
    end
  end
end
