# frozen_string_literal: true

class OtpRateLimit < ApplicationRecord
  WINDOW_MINUTES = 15
  MAX_ATTEMPTS = 5

  def self.allowed?(phone_number)
    record = find_by(phone_number: normalize_phone(phone_number))
    return true unless record
    return true if record.window_expired?
    record.attempt_count < MAX_ATTEMPTS
  end

  def self.record_attempt(phone_number)
    norm = normalize_phone(phone_number)
    record = find_or_initialize_by(phone_number: norm)
    if record.window_expired?
      record.update!(attempt_count: 1, window_start: Time.current)
    else
      record.increment!(:attempt_count)
    end
  end

  def self.normalize_phone(phone)
    phone.to_s.gsub(/\D/, "")
  end

  def window_expired?
    window_start < WINDOW_MINUTES.minutes.ago
  end
end
