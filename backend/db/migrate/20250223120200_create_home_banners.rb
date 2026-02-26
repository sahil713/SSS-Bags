# frozen_string_literal: true

class CreateHomeBanners < ActiveRecord::Migration[7.2]
  def change
    create_table :home_banners do |t|
      t.integer :position, default: 0, null: false
      t.string :link_url
      t.timestamps
    end
  end
end
