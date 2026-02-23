# frozen_string_literal: true

require "active_support/core_ext/integer/time"

Rails.application.configure do
  config.enable_reloading = true
  config.eager_load = false
  config.consider_all_requests_local = true
  config.server_timing = true
  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = {
    address: ENV["SMTP_ADDRESS"] || "localhost",
    port: (ENV["SMTP_PORT"] || 1025).to_i,
    domain: ENV["SMTP_DOMAIN"] || "localhost"
  }
  config.action_mailer.default_url_options = { host: ENV["HOST"] || "localhost", port: ENV["PORT"] || 3000 }
  config.active_storage.service = :local
  config.action_controller.raise_on_missing_callback_actions = true
end
