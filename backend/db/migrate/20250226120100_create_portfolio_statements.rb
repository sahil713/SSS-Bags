# frozen_string_literal: true

class CreatePortfolioStatements < ActiveRecord::Migration[7.2]
  def change
    create_table :portfolio_statements do |t|
      t.references :user, null: false, foreign_key: true
      t.string :broker
      t.date :statement_date
      t.jsonb :parsed_holdings, default: []
      t.string :parse_status, default: "pending"

      t.timestamps
    end

    add_index :portfolio_statements, [:user_id, :statement_date]
  end
end