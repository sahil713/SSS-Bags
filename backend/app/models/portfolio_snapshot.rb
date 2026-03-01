# frozen_string_literal: true

class PortfolioSnapshot < ApplicationRecord
  belongs_to :user

  validates :synced_at, presence: true

  scope :recent, -> { order(synced_at: :desc) }
  scope :by_date, -> { order(Arel.sql("COALESCE(snapshot_date, synced_at::date) DESC")) }

  def chart_date
    snapshot_date || synced_at&.to_date
  end
end
