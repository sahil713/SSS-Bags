# frozen_string_literal: true

module Api
  module V1
    class AuthController < BaseController
      skip_before_action :authenticate_user!, only: %i[signup login refresh verify_email]

      def signup
        user = User.new(signup_params)
        user.role = "customer"
        if user.save
          EmailVerificationJob.perform_later(user.id)
          access = JwtService.encode_access({ sub: user.id, role: user.role })
          refresh = JwtService.encode_refresh(user.id)
          user.update!(refresh_token: refresh, refresh_token_expires_at: 7.days.from_now)
          render json: {
            message: "Signed up. Verify your email to continue.",
            user: user_json(user),
            access_token: access,
            refresh_token: refresh,
            expires_in: JWT_ACCESS_EXP.to_i
          }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def login
        user = User.find_by(email: params[:email]&.downcase&.strip)
        unless user&.authenticate(params[:password])
          return render json: { error: "Invalid email or password" }, status: :unauthorized
        end

        access = JwtService.encode_access({ sub: user.id, role: user.role })
        refresh = JwtService.encode_refresh(user.id)
        user.update!(refresh_token: refresh, refresh_token_expires_at: 7.days.from_now)

        render json: {
          access_token: access,
          refresh_token: refresh,
          expires_in: JWT_ACCESS_EXP.to_i,
          user: user_json(user)
        }
      end

      def refresh
        token = request.headers["X-Refresh-Token"] || params[:refresh_token]
        return render json: { error: "Missing refresh token" }, status: :unauthorized if token.blank?

        payload = JwtService.decode_refresh(token)
        raise JWT::DecodeError unless payload

        user = User.find_by(id: payload.first["sub"])
        unless user && user.refresh_token == token && user.refresh_token_expires_at > Time.current
          return render json: { error: "Invalid or expired refresh token" }, status: :unauthorized
        end

        access = JwtService.encode_access({ sub: user.id, role: user.role })
        render json: { access_token: access, expires_in: JWT_ACCESS_EXP.to_i }
      rescue JWT::DecodeError
        render json: { error: "Invalid refresh token" }, status: :unauthorized
      end

      def resend_email_verification
        return render json: { error: "Email already verified" }, status: :unprocessable_entity if current_user.email_verified?

        EmailVerificationJob.perform_later(current_user.id)
        render json: { message: "Verification email sent. Check your inbox." }
      end

      def verify_email
        user = User.find_by(email: params[:email]&.downcase&.strip)
        return render json: { error: "User not found" }, status: :not_found unless user

        if EmailVerificationService.verify_token(user, params[:token])
          # Create session on successful verification so user is logged in
          access = JwtService.encode_access({ sub: user.id, role: user.role })
          refresh = JwtService.encode_refresh(user.id)
          user.update!(refresh_token: refresh, refresh_token_expires_at: 7.days.from_now)
          render json: {
            message: "Email verified",
            user: user_json(user),
            access_token: access,
            refresh_token: refresh,
            expires_in: JWT_ACCESS_EXP.to_i
          }
        else
          render json: { error: "Invalid or expired link" }, status: :unprocessable_entity
        end
      end

      def send_otp
        OtpService.send_otp(current_user)
        render json: { message: "OTP sent to your phone" }
      rescue OtpService::RateLimitExceeded
        render json: { error: "Too many attempts. Try again later." }, status: :too_many_requests
      rescue OtpService::TwilioError => e
        render json: { error: "Could not send OTP: #{e.message}" }, status: :unprocessable_entity
      end

      def verify_otp
        result = OtpService.verify_otp(current_user, params[:otp_code])
        if result[:success]
          render json: { message: "Phone verified", user: user_json(current_user) }
        else
          render json: { error: result[:error] }, status: :unprocessable_entity
        end
      end

      private

      def signup_params
        base = params.permit(:name, :email, :phone_number, :password, :password_confirmation).to_h
        if params[:auth].present?
          auth = params[:auth].permit(:name, :email, :phone_number, :password, :password_confirmation).to_h
          base = base.merge(auth.compact)
        end
        base
      end

      def user_json(u)
        {
          id: u.id,
          name: u.name,
          email: u.email,
          phone_number: u.phone_number,
          avatar_url: u.avatar.attached? ? rails_blob_url(u.avatar) : nil,
          role: u.role,
          email_verified: u.email_verified?,
          phone_verified: u.phone_verified?,
          active: u.active?
        }
      end

      def rails_blob_url(blob)
        Rails.application.routes.url_helpers.rails_blob_url(blob, host: request.base_url)
      end
    end
  end
end
