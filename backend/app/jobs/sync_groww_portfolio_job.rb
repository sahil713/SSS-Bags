# frozen_string_literal: true

class SyncGrowwPortfolioJob < ApplicationJob
  queue_as :default

  def perform(user_id)
    user = User.find_by(id: user_id)
    return unless user

    connection = user.groww_connection
    return unless connection&.linked?

    result = GrowwPortfolioService.fetch_holdings(connection)
    return unless result[:success]

    connection.update!(last_synced_at: Time.current)

    user.portfolio_snapshots.create!(
      holdings: result[:holdings] || [],
      total_value: result[:total_value] || 0,
      total_pnl: result[:total_pnl] || 0,
      total_pnl_percent: result[:total_pnl_percent] || 0,
      synced_at: Time.current
    )
  end
end
