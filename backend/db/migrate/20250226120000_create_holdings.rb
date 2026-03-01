# frozen_string_literal: true

class CreateHoldings < ActiveRecord::Migration[7.2]
  def change
    create_table :holdings do |t|
      t.references :user, null: false, foreign_key: true
      t.string :symbol, null: false
      t.string :isin
      t.string :name
      t.decimal :quantity, precision: 14, scale: 4, null: false
      t.decimal :avg_price, precision: 14, scale: 4, null: false
      t.decimal :current_price, precision: 14, scale: 4
      t.string :holding_type, default: "equity", null: false
      t.string :source, default: "manual", null: false
      t.text :notes

      t.timestamps
    end

    add_index :holdings, [:user_id, :symbol]
  end
end
