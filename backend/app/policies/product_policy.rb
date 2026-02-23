# frozen_string_literal: true

class ProductPolicy < ApplicationPolicy
  def index? = true
  def show? = true
  def create? = user&.admin?
  def update? = user&.admin?
  def destroy? = user&.admin?
  def toggle_status? = user&.admin?
end
