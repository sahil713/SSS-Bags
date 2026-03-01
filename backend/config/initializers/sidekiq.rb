# frozen_string_literal: true

# Skip loading Sidekiq/Redis during db:* tasks (avoids connection_pool load on Ruby 3.3.0)
if defined?(Rake) && Rake.application.top_level_tasks.any? { |t| t.to_s.start_with?("db:") }
  return
end

require "redis"
require "sidekiq"

Sidekiq.configure_server do |config|
  config.redis = { url: ENV.fetch("REDIS_URL", "redis://localhost:6379/0") }
end

Sidekiq.configure_client do |config|
  config.redis = { url: ENV.fetch("REDIS_URL", "redis://localhost:6379/0") }
end

# Ensure roo is loaded for ParsePortfolioPdfJob (XLSX parsing) when Sidekiq runs jobs
require "roo"
