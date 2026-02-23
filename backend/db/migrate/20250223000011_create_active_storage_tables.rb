# frozen_string_literal: true

class CreateActiveStorageTables < ActiveRecord::Migration[7.2]
  def change
    create_table :active_storage_blobs do |t|
      t.string :key, null: false, index: { unique: true }
      t.string :filename, null: false
      t.string :content_type
      t.text :metadata
      t.bigint :byte_size, null: false
      t.string :checksum, null: false

      t.datetime :created_at, null: false
    end

    create_table :active_storage_attachments do |t|
      t.string :name, null: false
      t.references :record, null: false, polymorphic: true, index: false
      t.references :blob, null: false, foreign_key: { to_table: :active_storage_blobs }

      t.datetime :created_at, null: false
    end
    add_index :active_storage_attachments, %i[record_type record_id name blob_id], name: "index_active_storage_attachments_uniqueness", unique: true
  end
end
