# frozen_string_literal: true

class CreateInvestmentStrategies < ActiveRecord::Migration[7.2]
  def change
    create_table :investment_strategies do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.text :description
      t.jsonb :rules, default: {}
      t.string :strategy_type, default: "rule_based"

      t.timestamps
    end

    add_index :investment_strategies, [:user_id, :strategy_type]
  end
end