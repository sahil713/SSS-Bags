# frozen_string_literal: true

class UserPolicy < ApplicationPolicy
  def index? = user&.admin?
  def show? = user&.admin? || record.id == user&.id
  def update? = user&.admin? || record.id == user&.id
  def destroy? = user&.admin?
end
