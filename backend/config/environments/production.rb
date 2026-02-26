# frozen_string_literal: true

require "active_support/core_ext/integer/time"

Rails.application.configure do
  config.enable_reloading = false
  config.eager_load = true
  config.consider_all_requests_local = false
  config.action_controller.raise_on_missing_callback_actions = true
  config.log_level = :info
  config.log_tags = [ :request_id ]
  # Required on Render/Heroku: set SECRET_KEY_BASE in the environment (e.g. from `openssl rand -hex 64`).
  config.secret_key_base = ENV["SECRET_KEY_BASE"]
  # Use S3 only when AWS credentials are set; otherwise use local disk (e.g. on Render free tier).
  config.active_storage.service = ENV["AWS_ACCESS_KEY_ID"].present? ? :amazon : :local
end
