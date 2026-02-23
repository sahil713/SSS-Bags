# frozen_string_literal: true

class OrderPolicy < ApplicationPolicy
  def index? = user.present?
  def show? = user.present? && (user.admin? || record.user_id == user.id)
  def track? = show?
  def create? = user&.customer?
  def update? = user&.admin?
  def update_status? = user&.admin?
end
