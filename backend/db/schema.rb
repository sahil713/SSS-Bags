# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2026_02_26_132813) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.string "service_name", default: "local", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "addresses", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "label"
    t.string "line1", null: false
    t.string "line2"
    t.string "city", null: false
    t.string "state"
    t.string "pincode", null: false
    t.string "phone"
    t.boolean "default", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "default"], name: "index_addresses_on_user_id_and_default"
    t.index ["user_id"], name: "index_addresses_on_user_id"
  end

  create_table "announcements", force: :cascade do |t|
    t.text "message", null: false
    t.boolean "is_active", default: true, null: false
    t.string "background_color"
    t.string "text_color"
    t.datetime "start_date"
    t.datetime "end_date"
    t.string "link"
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["deleted_at"], name: "index_announcements_on_deleted_at"
    t.index ["is_active"], name: "index_announcements_on_is_active"
    t.index ["start_date", "end_date"], name: "index_announcements_on_start_date_and_end_date"
  end

  create_table "banners", force: :cascade do |t|
    t.string "title", default: "", null: false
    t.string "subtitle"
    t.text "description"
    t.string "button_text"
    t.string "button_link"
    t.string "banner_type", default: "homepage", null: false
    t.boolean "is_active", default: true, null: false
    t.datetime "start_date"
    t.datetime "end_date"
    t.integer "priority", default: 0, null: false
    t.string "background_color"
    t.string "text_color"
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["banner_type"], name: "index_banners_on_banner_type"
    t.index ["deleted_at"], name: "index_banners_on_deleted_at"
    t.index ["is_active"], name: "index_banners_on_is_active"
    t.index ["priority"], name: "index_banners_on_priority"
    t.index ["start_date", "end_date"], name: "index_banners_on_start_date_and_end_date"
  end

  create_table "cart_items", force: :cascade do |t|
    t.bigint "cart_id", null: false
    t.bigint "product_id", null: false
    t.integer "quantity", default: 1, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["cart_id", "product_id"], name: "index_cart_items_on_cart_id_and_product_id", unique: true
    t.index ["cart_id"], name: "index_cart_items_on_cart_id"
    t.index ["product_id"], name: "index_cart_items_on_product_id"
  end

  create_table "carts", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_carts_on_user_id", unique: true
  end

  create_table "categories", force: :cascade do |t|
    t.string "name", null: false
    t.string "slug", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_categories_on_slug", unique: true
  end

  create_table "groww_connections", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.text "api_key"
    t.text "secret"
    t.string "totp_secret"
    t.datetime "linked_at"
    t.datetime "last_synced_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_groww_connections_on_user_id", unique: true
  end

  create_table "holdings", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "symbol", null: false
    t.string "isin"
    t.string "name"
    t.decimal "quantity", precision: 14, scale: 4, null: false
    t.decimal "avg_price", precision: 14, scale: 4, null: false
    t.decimal "current_price", precision: 14, scale: 4
    t.string "holding_type", default: "equity", null: false
    t.string "source", default: "manual", null: false
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "symbol"], name: "index_holdings_on_user_id_and_symbol"
    t.index ["user_id"], name: "index_holdings_on_user_id"
  end

  create_table "home_banners", force: :cascade do |t|
    t.integer "position", default: 0, null: false
    t.string "link_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "investment_pnl_records", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "period_type", default: "monthly", null: false
    t.date "period_start", null: false
    t.date "period_end", null: false
    t.decimal "realised_pnl", precision: 14, scale: 2, default: "0.0"
    t.decimal "unrealised_pnl", precision: 14, scale: 2, default: "0.0"
    t.decimal "dividend_income", precision: 14, scale: 2, default: "0.0"
    t.decimal "intraday_pnl", precision: 14, scale: 2, default: "0.0"
    t.decimal "fno_pnl", precision: 14, scale: 2, default: "0.0"
    t.decimal "total_charges", precision: 14, scale: 2, default: "0.0"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "period_type", "period_start"], name: "idx_pnl_user_period"
    t.index ["user_id"], name: "index_investment_pnl_records_on_user_id"
  end

  create_table "investment_strategies", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name", null: false
    t.text "description"
    t.jsonb "rules", default: {}
    t.string "strategy_type", default: "rule_based"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "strategy_type"], name: "index_investment_strategies_on_user_id_and_strategy_type"
    t.index ["user_id"], name: "index_investment_strategies_on_user_id"
  end

  create_table "investment_tax_records", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "financial_year", null: false
    t.decimal "elss_deduction", precision: 14, scale: 2, default: "0.0"
    t.decimal "stcg_amount", precision: 14, scale: 2, default: "0.0"
    t.decimal "ltcg_amount", precision: 14, scale: 2, default: "0.0"
    t.decimal "intraday_pnl", precision: 14, scale: 2, default: "0.0"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "financial_year"], name: "index_investment_tax_records_on_user_id_and_financial_year", unique: true
    t.index ["user_id"], name: "index_investment_tax_records_on_user_id"
  end

  create_table "investment_transactions", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "transaction_type", null: false
    t.string "asset_type", default: "stocks", null: false
    t.string "symbol", null: false
    t.string "name"
    t.decimal "quantity", precision: 14, scale: 4, null: false
    t.decimal "price", precision: 14, scale: 4, null: false
    t.decimal "amount", precision: 14, scale: 2, null: false
    t.date "transaction_date", null: false
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "symbol"], name: "index_investment_transactions_on_user_id_and_symbol"
    t.index ["user_id", "transaction_date"], name: "index_investment_transactions_on_user_id_and_transaction_date"
    t.index ["user_id"], name: "index_investment_transactions_on_user_id"
  end

  create_table "order_items", force: :cascade do |t|
    t.bigint "order_id", null: false
    t.bigint "product_id", null: false
    t.integer "quantity", null: false
    t.decimal "price_at_purchase", precision: 10, scale: 2, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["order_id"], name: "index_order_items_on_order_id"
    t.index ["product_id"], name: "index_order_items_on_product_id"
  end

  create_table "orders", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.decimal "total_price", precision: 12, scale: 2, null: false
    t.jsonb "shipping_address", default: {}, null: false
    t.string "status", default: "pending", null: false
    t.string "payment_status", default: "pending", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["payment_status"], name: "index_orders_on_payment_status"
    t.index ["status"], name: "index_orders_on_status"
    t.index ["user_id", "created_at"], name: "index_orders_on_user_id_and_created_at"
    t.index ["user_id"], name: "index_orders_on_user_id"
  end

  create_table "otp_rate_limits", force: :cascade do |t|
    t.string "phone_number", null: false
    t.integer "attempt_count", default: 0, null: false
    t.datetime "window_start", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["phone_number"], name: "index_otp_rate_limits_on_phone_number", unique: true
  end

  create_table "payments", force: :cascade do |t|
    t.bigint "order_id", null: false
    t.string "transaction_id"
    t.string "status", default: "initiated", null: false
    t.jsonb "metadata", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["order_id"], name: "index_payments_on_order_id"
    t.index ["status"], name: "index_payments_on_status"
    t.index ["transaction_id"], name: "index_payments_on_transaction_id"
  end

  create_table "portfolio_snapshots", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.jsonb "holdings", default: []
    t.decimal "total_value", precision: 14, scale: 2
    t.decimal "total_pnl", precision: 14, scale: 2
    t.decimal "total_pnl_percent", precision: 8, scale: 2
    t.datetime "synced_at", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.date "snapshot_date"
    t.index ["user_id", "snapshot_date"], name: "index_portfolio_snapshots_on_user_id_and_snapshot_date"
    t.index ["user_id", "synced_at"], name: "index_portfolio_snapshots_on_user_id_and_synced_at"
    t.index ["user_id"], name: "index_portfolio_snapshots_on_user_id"
  end

  create_table "portfolio_statements", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "broker"
    t.date "statement_date"
    t.jsonb "parsed_holdings", default: []
    t.string "parse_status", default: "pending"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "document_type"
    t.string "document_sub_type"
    t.jsonb "parsed_data", default: {}
    t.index ["user_id", "document_type", "document_sub_type"], name: "idx_on_user_id_document_type_document_sub_type_68b7e9eefb"
    t.index ["user_id", "statement_date"], name: "index_portfolio_statements_on_user_id_and_statement_date"
    t.index ["user_id"], name: "index_portfolio_statements_on_user_id"
  end

  create_table "products", force: :cascade do |t|
    t.bigint "category_id", null: false
    t.string "name", null: false
    t.text "description"
    t.decimal "price", precision: 10, scale: 2, null: false
    t.decimal "discount_price", precision: 10, scale: 2
    t.integer "stock_quantity", default: 0, null: false
    t.string "slug", null: false
    t.string "status", default: "active", null: false
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "featured", default: false, null: false
    t.index ["category_id"], name: "index_products_on_category_id"
    t.index ["deleted_at"], name: "index_products_on_deleted_at"
    t.index ["featured"], name: "index_products_on_featured"
    t.index ["slug"], name: "index_products_on_slug", unique: true
    t.index ["status"], name: "index_products_on_status"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "phone_number", null: false
    t.string "password_digest", null: false
    t.string "role", default: "customer", null: false
    t.boolean "email_verified", default: false, null: false
    t.boolean "phone_verified", default: false, null: false
    t.string "email_verification_token"
    t.datetime "email_verification_sent_at"
    t.datetime "email_verified_at"
    t.string "otp_code"
    t.datetime "otp_sent_at"
    t.datetime "phone_verified_at"
    t.string "refresh_token"
    t.datetime "refresh_token_expires_at"
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["deleted_at"], name: "index_users_on_deleted_at"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["phone_number"], name: "index_users_on_phone_number", unique: true
    t.index ["refresh_token"], name: "index_users_on_refresh_token", unique: true
    t.index ["role"], name: "index_users_on_role"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "addresses", "users"
  add_foreign_key "cart_items", "carts"
  add_foreign_key "cart_items", "products"
  add_foreign_key "carts", "users"
  add_foreign_key "groww_connections", "users"
  add_foreign_key "holdings", "users"
  add_foreign_key "investment_pnl_records", "users"
  add_foreign_key "investment_strategies", "users"
  add_foreign_key "investment_tax_records", "users"
  add_foreign_key "investment_transactions", "users"
  add_foreign_key "order_items", "orders"
  add_foreign_key "order_items", "products"
  add_foreign_key "orders", "users"
  add_foreign_key "payments", "orders"
  add_foreign_key "portfolio_snapshots", "users"
  add_foreign_key "portfolio_statements", "users"
  add_foreign_key "products", "categories"
end
