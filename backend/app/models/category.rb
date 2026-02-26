# frozen_string_literal: true

class Category < ApplicationRecord
  has_one_attached :image
  has_many :products, dependent: :restrict_with_error

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: true

  before_validation :generate_slug

  def self.by_slug(slug)
    find_by!(slug: slug)
  end

  private

  def generate_slug
    self.slug = (slug.presence || name&.parameterize).to_s
    return if slug.blank?
    self.slug = "#{slug}-#{SecureRandom.hex(4)}" while Category.where.not(id: id).exists?(slug: slug)
  end
end
