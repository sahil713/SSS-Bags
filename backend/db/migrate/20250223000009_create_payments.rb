# frozen_string_literal: true

class CreatePayments < ActiveRecord::Migration[7.2]
  def change
    create_table :payments do |t|
      t.references :order, null: false, foreign_key: true
      t.string :transaction_id
      t.string :status, default: "initiated", null: false
      t.jsonb :metadata, default: {}

      t.timestamps
    end
    add_index :payments, :transaction_id
    add_index :payments, :status
  end
end
