# frozen_string_literal: true

class AddGrowwDocumentTypes < ActiveRecord::Migration[7.2]
  def change
    add_column :portfolio_statements, :document_type, :string
    add_column :portfolio_statements, :document_sub_type, :string
    add_column :portfolio_statements, :parsed_data, :jsonb, default: {}
    add_index :portfolio_statements, [:user_id, :document_type, :document_sub_type]
  end
end
