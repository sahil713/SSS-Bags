# frozen_string_literal: true

class CreateOtpRateLimits < ActiveRecord::Migration[7.2]
  def change
    create_table :otp_rate_limits do |t|
      t.string :phone_number, null: false
      t.integer :attempt_count, default: 0, null: false
      t.datetime :window_start, null: false

      t.timestamps
    end
    add_index :otp_rate_limits, :phone_number, unique: true
  end
end
