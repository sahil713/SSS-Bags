# frozen_string_literal: true

class GrowwConnection < ApplicationRecord
  belongs_to :user

  validates :user_id, uniqueness: true

  def linked?
    linked_at.present?
  end

  def unlink!
    update!(api_key: nil, secret: nil, totp_secret: nil, linked_at: nil)
  end
end
