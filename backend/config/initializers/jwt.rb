# frozen_string_literal: true

JWT_ISSUER = ENV.fetch("JWT_ISSUER", "sss_bags_api")
JWT_ACCESS_EXP = ENV.fetch("JWT_ACCESS_EXP", "15").to_i.minutes
JWT_REFRESH_EXP = ENV.fetch("JWT_REFRESH_EXP", "7").to_i.days
JWT_SECRET = ENV.fetch("JWT_SECRET") { Rails.application.credentials&.secret_key_base || "dev_secret_change_in_production" }
