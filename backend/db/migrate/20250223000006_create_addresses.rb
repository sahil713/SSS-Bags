# frozen_string_literal: true

class CreateAddresses < ActiveRecord::Migration[7.2]
  def change
    create_table :addresses do |t|
      t.references :user, null: false, foreign_key: true
      t.string :label
      t.string :line1, null: false
      t.string :line2
      t.string :city, null: false
      t.string :state
      t.string :pincode, null: false
      t.string :phone
      t.boolean :default, default: false

      t.timestamps
    end
    add_index :addresses, %i[user_id default]
  end
end
