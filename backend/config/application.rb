# frozen_string_literal: true

require_relative "boot"

require "rails"
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "active_storage/engine"

Bundler.require(*Rails.groups)

module SssBags
  class Application < Rails::Application
    config.load_defaults 7.2
    config.api_only = true
    config.autoload_paths += %W[#{config.root}/app/services #{config.root}/app/policies]
    config.active_job.queue_adapter = :sidekiq
  end
end
