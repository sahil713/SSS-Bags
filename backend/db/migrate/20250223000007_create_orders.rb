# frozen_string_literal: true

class CreateOrders < ActiveRecord::Migration[7.2]
  def change
    create_table :orders do |t|
      t.references :user, null: false, foreign_key: true
      t.decimal :total_price, precision: 12, scale: 2, null: false
      t.jsonb :shipping_address, null: false, default: {}
      t.string :status, default: "pending", null: false
      t.string :payment_status, default: "pending", null: false

      t.timestamps
    end
    add_index :orders, :status
    add_index :orders, :payment_status
    add_index :orders, %i[user_id created_at]
  end
end
