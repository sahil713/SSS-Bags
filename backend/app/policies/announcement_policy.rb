# frozen_string_literal: true

class AnnouncementPolicy < ApplicationPolicy
  def index? = user&.admin?
  def show? = user&.admin?
  def create? = user&.admin?
  def update? = user&.admin?
  def destroy? = user&.admin?
  def activate? = user&.admin?
end
