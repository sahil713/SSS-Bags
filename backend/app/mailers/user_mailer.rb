# frozen_string_literal: true

class UserMailer < ApplicationMailer
  def email_verification(user)
    @user = user
    @token = EmailVerificationService.generate_token(user)
    @verify_url = "#{ENV.fetch('FRONTEND_URL', 'http://localhost:5173')}/verify-email?token=#{@token}&email=#{ERB::Util.url_encode(user.email)}"
    mail(to: user.email, subject: "Verify your SSS BAGS account")
  end
end
