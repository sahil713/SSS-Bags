# frozen_string_literal: true

class HomeBanner < ApplicationRecord
  has_one_attached :image
  validates :position, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
end
