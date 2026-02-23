# frozen_string_literal: true

Rails.application.config.filter_parameters += %i[password password_confirmation token otp_code refresh_token]
