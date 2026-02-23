# frozen_string_literal: true

class JwtService
  class << self
    def encode_access(payload)
      payload = payload.merge(exp: (Time.current + JWT_ACCESS_EXP).to_i, iss: JWT_ISSUER, type: "access")
      JWT.encode(payload, JWT_SECRET, "HS256")
    end

    def encode_refresh(user_id)
      payload = { sub: user_id, exp: (Time.current + JWT_REFRESH_EXP).to_i, iss: JWT_ISSUER, type: "refresh" }
      JWT.encode(payload, JWT_SECRET, "HS256")
    end

    def decode_access(token)
      decoded = JWT.decode(token, JWT_SECRET, true, { algorithm: "HS256", verify_iss: true, iss: JWT_ISSUER })
      raise JWT::DecodeError if decoded.first["type"] != "access"
      decoded
    rescue JWT::ExpiredSignature
      nil
    end

    def decode_refresh(token)
      decoded = JWT.decode(token, JWT_SECRET, true, { algorithm: "HS256", verify_iss: true, iss: JWT_ISSUER })
      raise JWT::DecodeError if decoded.first["type"] != "refresh"
      decoded
    rescue JWT::ExpiredSignature
      nil
    end
  end
end
