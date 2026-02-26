# frozen_string_literal: true

class AddFeaturedToProducts < ActiveRecord::Migration[7.2]
  def change
    add_column :products, :featured, :boolean, default: false, null: false
    add_index :products, :featured
  end
end
