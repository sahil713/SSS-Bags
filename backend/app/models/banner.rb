# frozen_string_literal: true

class Banner < ApplicationRecord
  include SoftDeletable

  BANNER_TYPES = %w[homepage category flash_sale announcement_bar].freeze

  has_one_attached :image do |attachable|
    attachable.variant :thumb, resize_to_limit: [400, 200]
    attachable.variant :medium, resize_to_limit: [1200, 600]
    attachable.variant :large, resize_to_limit: [1920, 800]
  end

  validates :title, presence: true
  validates :banner_type, inclusion: { in: BANNER_TYPES }
  validates :priority, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validate :end_date_after_start_date
  validate :image_content_type, if: -> { image.attached? }
  validate :image_size, if: -> { image.attached? }

  scope :active, -> { where(is_active: true) }
  scope :not_deleted, -> { where(deleted_at: nil) }
  scope :by_priority, -> { order(priority: :asc, created_at: :desc) }

  scope :currently_valid, -> {
    where("(start_date IS NULL OR start_date <= ?) AND (end_date IS NULL OR end_date >= ?)", Time.current, Time.current)
  }

  def self.active_for_public(banner_type = nil)
    scope = active.not_deleted.currently_valid.by_priority
    scope = scope.where(banner_type: banner_type) if banner_type.present?
    scope
  end

  private

  def end_date_after_start_date
    return if start_date.blank? || end_date.blank?
    errors.add(:end_date, "must be after start date") if end_date < start_date
  end

  def image_content_type
    allowed = %w[image/jpeg image/png image/gif image/webp]
    return if image.content_type.in?(allowed)
    errors.add(:image, "must be JPEG, PNG, GIF, or WebP")
  end

  def image_size
    return if image.blob.byte_size <= 5.megabytes
    errors.add(:image, "must be under 5MB")
  end
end
