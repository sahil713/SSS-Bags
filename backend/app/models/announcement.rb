# frozen_string_literal: true

class Announcement < ApplicationRecord
  include SoftDeletable

  validates :message, presence: true

  scope :active, -> { where(is_active: true) }
  scope :not_deleted, -> { where(deleted_at: nil) }
  scope :currently_valid, -> {
    where("(start_date IS NULL OR start_date <= ?) AND (end_date IS NULL OR end_date >= ?)", Time.current, Time.current)
  }

  def self.active_for_public
    active.not_deleted.currently_valid.order(created_at: :desc)
  end
end
