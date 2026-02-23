# frozen_string_literal: true

class Payment < ApplicationRecord
  STATUSES = %w[initiated success failed].freeze

  belongs_to :order

  validates :status, inclusion: { in: STATUSES }
end
