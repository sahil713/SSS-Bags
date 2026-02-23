# frozen_string_literal: true

require "active_support/core_ext/integer/time"

Rails.application.configure do
  config.enable_reloading = false
  config.eager_load = true
  config.consider_all_requests_local = false
  config.action_controller.raise_on_missing_callback_actions = true
  config.log_level = :info
  config.log_tags = [ :request_id ]
  config.active_storage.service = :amazon
end
