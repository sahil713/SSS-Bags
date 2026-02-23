# frozen_string_literal: true

class ApplicationJob < ActiveJob::Base
  self.queue_adapter = :sidekiq
end
