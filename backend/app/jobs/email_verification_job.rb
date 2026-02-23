# frozen_string_literal: true

class EmailVerificationJob < ApplicationJob
  queue_as :default

  def perform(user_id)
    user = User.find_by(id: user_id)
    return unless user
    UserMailer.email_verification(user).deliver_now
  end
end
