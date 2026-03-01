# frozen_string_literal: true

class PortfolioStatement < ApplicationRecord
  belongs_to :user
  has_one_attached :file

  PARSE_STATUSES = %w[pending processing completed failed].freeze

  validates :parse_status, inclusion: { in: PARSE_STATUSES }
end
