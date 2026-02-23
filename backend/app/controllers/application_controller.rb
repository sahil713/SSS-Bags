# frozen_string_literal: true

class ApplicationController < ActionController::API
  include Pundit::Authorization

  before_action :authenticate_user!

  rescue_from Pundit::NotAuthorizedError, with: :forbidden
  rescue_from ActiveRecord::RecordNotFound, with: :not_found

  private

  def current_user
    @current_user ||= (payload && User.find_by(id: payload["sub"]))
  end

  def payload
    return nil unless request.headers["Authorization"].to_s.start_with?("Bearer ")
    token = request.headers["Authorization"].split(" ").last
    decoded = JwtService.decode_access(token)
    decoded&.first
  rescue JWT::DecodeError
    nil
  end

  def authenticate_user!
    render json: { error: "Unauthorized" }, status: :unauthorized unless current_user
  end

  def authenticate_admin!
    authenticate_user!
    render json: { error: "Forbidden" }, status: :forbidden unless current_user&.admin?
  end

  def forbidden
    render json: { error: "Forbidden" }, status: :forbidden
  end

  def not_found
    render json: { error: "Not found" }, status: :not_found
  end
end
