# frozen_string_literal: true

class CategoryPolicy < ApplicationPolicy
  def index? = true
  def show? = true
  def create? = user&.admin?
  def update? = user&.admin?
  def destroy? = user&.admin?
end
