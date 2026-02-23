# frozen_string_literal: true

Rails.application.configure do
  config.enable_reloading = false
  config.eager_load = :all
  config.public_file_server.enabled = true
  config.action_mailer.delivery_method = :test
  config.active_storage.service = :test
end
