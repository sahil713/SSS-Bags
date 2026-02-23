# frozen_string_literal: true

class AddServiceNameToActiveStorageBlobs < ActiveRecord::Migration[7.2]
  def change
    return if column_exists?(:active_storage_blobs, :service_name)
    add_column :active_storage_blobs, :service_name, :string, null: false, default: "local"
  end
end
