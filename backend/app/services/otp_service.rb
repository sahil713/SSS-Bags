# frozen_string_literal: true

class OtpService
  OTP_LENGTH = 6
  OTP_VALID_MINUTES = 10

  class RateLimitExceeded < StandardError; end
  class TwilioError < StandardError; end

  def self.send_otp(user)
    new(user).send_otp
  end

  def self.verify_otp(user, code)
    new(user).verify_otp(code)
  end

  def initialize(user)
    @user = user
  end

  def send_otp
    raise RateLimitExceeded unless OtpRateLimit.allowed?(@user.phone_number)

    code = rand(10**OTP_LENGTH).to_s.rjust(OTP_LENGTH, "0")
    @user.update!(otp_code: code, otp_sent_at: Time.current)
    OtpRateLimit.record_attempt(@user.phone_number)

    if defined?(Twilio)
      client = Twilio::REST::Client.new(ENV["TWILIO_ACCOUNT_SID"], ENV["TWILIO_AUTH_TOKEN"])
      client.messages.create(
        from: ENV["TWILIO_PHONE_NUMBER"],
        to: "+#{@user.phone_number}",
        body: "Your SSS BAGS verification code is: #{code}. Valid for #{OTP_VALID_MINUTES} minutes."
      )
    end

    { success: true, message: "OTP sent" }
  rescue Twilio::REST::RestError => e
    raise TwilioError, e.message
  end

  def verify_otp(code)
    return { success: false, error: "Invalid or expired OTP" } if @user.otp_code.blank?
    return { success: false, error: "OTP expired" } if @user.otp_sent_at < OTP_VALID_MINUTES.minutes.ago

    if @user.otp_code == code.to_s.strip
      @user.update!(phone_verified: true, phone_verified_at: Time.current, otp_code: nil, otp_sent_at: nil)
      { success: true }
    else
      { success: false, error: "Invalid OTP" }
    end
  end
end
