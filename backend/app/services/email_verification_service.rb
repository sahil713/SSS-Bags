# frozen_string_literal: true

class EmailVerificationService
  TOKEN_VALID_HOURS = 24

  def self.generate_token(user)
    raw = SecureRandom.urlsafe_base64(32)
    token = Digest::SHA256.hexdigest(raw)
    user.update!(email_verification_token: token, email_verification_sent_at: Time.current)
    raw
  end

  def self.verify_token(user, raw_token)
    return false if user.email_verification_token.blank?
    return false if user.email_verification_sent_at < TOKEN_VALID_HOURS.hours.ago

    digest = Digest::SHA256.hexdigest(raw_token)
    if ActiveSupport::SecurityUtils.secure_compare(user.email_verification_token, digest)
      user.update!(email_verified: true, email_verified_at: Time.current, email_verification_token: nil, email_verification_sent_at: nil)
      true
    else
      false
    end
  end
end
