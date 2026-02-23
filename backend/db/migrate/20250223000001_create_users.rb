# frozen_string_literal: true

class CreateUsers < ActiveRecord::Migration[7.2]
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.string :email, null: false, index: { unique: true }
      t.string :phone_number, null: false, index: { unique: true }
      t.string :password_digest, null: false
      t.string :role, null: false, default: "customer"
      t.boolean :email_verified, default: false, null: false
      t.boolean :phone_verified, default: false, null: false
      t.string :email_verification_token
      t.datetime :email_verification_sent_at
      t.datetime :email_verified_at
      t.string :otp_code
      t.datetime :otp_sent_at
      t.datetime :phone_verified_at
      t.string :refresh_token, index: { unique: true }
      t.datetime :refresh_token_expires_at
      t.datetime :deleted_at

      t.timestamps
    end
    add_index :users, :deleted_at
    add_index :users, :role
  end
end
