# frozen_string_literal: true

class CreateProducts < ActiveRecord::Migration[7.2]
  def change
    create_table :products do |t|
      t.references :category, null: false, foreign_key: true
      t.string :name, null: false
      t.text :description
      t.decimal :price, precision: 10, scale: 2, null: false
      t.decimal :discount_price, precision: 10, scale: 2
      t.integer :stock_quantity, default: 0, null: false
      t.string :slug, null: false, index: { unique: true }
      t.string :status, default: "active", null: false
      t.datetime :deleted_at

      t.timestamps
    end
    add_index :products, :deleted_at
    add_index :products, :status
  end
end
