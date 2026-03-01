# frozen_string_literal: true

class CreateGrowwConnections < ActiveRecord::Migration[7.2]
  def change
    create_table :groww_connections do |t|
      t.references :user, null: false, foreign_key: true, index: { unique: true }
      t.text :api_key
      t.text :secret
      t.string :totp_secret
      t.datetime :linked_at
      t.datetime :last_synced_at

      t.timestamps
    end
  end
end
