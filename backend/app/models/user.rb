# frozen_string_literal: true

class User < ApplicationRecord
  include SoftDeletable

  ROLES = %w[admin customer].freeze

  has_secure_password

  has_one :cart, dependent: :destroy
  has_many :addresses, dependent: :destroy
  has_many :orders, dependent: :restrict_with_error

  validates :name, presence: true
  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates :phone_number, presence: true, uniqueness: true
  validates :role, inclusion: { in: ROLES }

  normalizes :email, with: ->(e) { e&.strip&.downcase }
  normalizes :phone_number, with: ->(p) { p&.strip&.gsub(/\D/, "") }

  after_create :create_cart!
  default_scope { not_deleted }

  def admin?
    role == "admin"
  end

  def customer?
    role == "customer"
  end

  def active?
    email_verified? && phone_verified?
  end

  def default_address
    addresses.find_by(default: true) || addresses.first
  end

  private

  def create_cart!
    Cart.create!(user_id: id)
  end
end
