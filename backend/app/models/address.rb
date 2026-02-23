# frozen_string_literal: true

class Address < ApplicationRecord
  belongs_to :user

  validates :line1, :city, :pincode, presence: true

  after_save :clear_other_defaults, if: :default?

  def full_address
    [line1, line2, city, state, pincode].compact.join(", ")
  end

  def as_shipping_hash
    { line1: line1, line2: line2, city: city, state: state, pincode: pincode, phone: phone, label: label }
  end

  private

  def clear_other_defaults
    user.addresses.where.not(id: id).update_all(default: false)
  end
end
