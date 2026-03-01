# frozen_string_literal: true

class CreatePortfolioSnapshots < ActiveRecord::Migration[7.2]
  def change
    create_table :portfolio_snapshots do |t|
      t.references :user, null: false, foreign_key: true
      t.jsonb :holdings, default: []
      t.decimal :total_value, precision: 14, scale: 2
      t.decimal :total_pnl, precision: 14, scale: 2
      t.decimal :total_pnl_percent, precision: 8, scale: 2
      t.datetime :synced_at, null: false

      t.timestamps
    end

    add_index :portfolio_snapshots, [:user_id, :synced_at]
  end
end
