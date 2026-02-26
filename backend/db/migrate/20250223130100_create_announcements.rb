# frozen_string_literal: true

class CreateAnnouncements < ActiveRecord::Migration[7.2]
  def change
    create_table :announcements do |t|
      t.text :message, null: false
      t.boolean :is_active, null: false, default: true
      t.string :background_color
      t.string :text_color
      t.datetime :start_date
      t.datetime :end_date
      t.string :link
      t.datetime :deleted_at

      t.timestamps
    end

    add_index :announcements, :is_active
    add_index :announcements, [:start_date, :end_date]
    add_index :announcements, :deleted_at
  end
end
