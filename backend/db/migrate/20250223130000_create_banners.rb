# frozen_string_literal: true

class CreateBanners < ActiveRecord::Migration[7.2]
  def change
    create_table :banners do |t|
      t.string :title, null: false, default: ""
      t.string :subtitle
      t.text :description
      t.string :button_text
      t.string :button_link
      t.string :banner_type, null: false, default: "homepage"
      t.boolean :is_active, null: false, default: true
      t.datetime :start_date
      t.datetime :end_date
      t.integer :priority, null: false, default: 0
      t.string :background_color
      t.string :text_color
      t.datetime :deleted_at

      t.timestamps
    end

    add_index :banners, :banner_type
    add_index :banners, :is_active
    add_index :banners, :priority
    add_index :banners, [:start_date, :end_date]
    add_index :banners, :deleted_at
  end
end
