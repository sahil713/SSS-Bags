# frozen_string_literal: true

class CreateInvestmentManualDataTables < ActiveRecord::Migration[7.2]
  def change
    # P&L records - monthly/yearly summaries (realised, unrealised, dividend, F&O, etc.)
    create_table :investment_pnl_records do |t|
      t.references :user, null: false, foreign_key: true
      t.string :period_type, null: false, default: "monthly" # monthly, yearly
      t.date :period_start, null: false
      t.date :period_end, null: false
      t.decimal :realised_pnl, precision: 14, scale: 2, default: 0
      t.decimal :unrealised_pnl, precision: 14, scale: 2, default: 0
      t.decimal :dividend_income, precision: 14, scale: 2, default: 0
      t.decimal :intraday_pnl, precision: 14, scale: 2, default: 0
      t.decimal :fno_pnl, precision: 14, scale: 2, default: 0
      t.decimal :total_charges, precision: 14, scale: 2, default: 0
      t.text :notes
      t.timestamps
    end
    add_index :investment_pnl_records, [:user_id, :period_type, :period_start], name: "idx_pnl_user_period"

    # Tax records - financial year summaries (ELSS, STCG, LTCG)
    create_table :investment_tax_records do |t|
      t.references :user, null: false, foreign_key: true
      t.string :financial_year, null: false # e.g. "2024-25"
      t.decimal :elss_deduction, precision: 14, scale: 2, default: 0
      t.decimal :stcg_amount, precision: 14, scale: 2, default: 0
      t.decimal :ltcg_amount, precision: 14, scale: 2, default: 0
      t.decimal :intraday_pnl, precision: 14, scale: 2, default: 0
      t.text :notes
      t.timestamps
    end
    add_index :investment_tax_records, [:user_id, :financial_year], unique: true

    # Transactions - individual buy/sell trades
    create_table :investment_transactions do |t|
      t.references :user, null: false, foreign_key: true
      t.string :transaction_type, null: false # buy, sell
      t.string :asset_type, null: false, default: "stocks" # stocks, mf
      t.string :symbol, null: false
      t.string :name
      t.decimal :quantity, precision: 14, scale: 4, null: false
      t.decimal :price, precision: 14, scale: 4, null: false
      t.decimal :amount, precision: 14, scale: 2, null: false
      t.date :transaction_date, null: false
      t.text :notes
      t.timestamps
    end
    add_index :investment_transactions, [:user_id, :transaction_date]
    add_index :investment_transactions, [:user_id, :symbol]

    # Portfolio value snapshots - for charting (manual entry or snapshot)
    # Enhance portfolio_snapshots with snapshot_date for manual entry
    add_column :portfolio_snapshots, :snapshot_date, :date
    add_index :portfolio_snapshots, [:user_id, :snapshot_date]
  end
end
