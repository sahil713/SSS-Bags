# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Api::V1::Auth", type: :request do
  path "/api/v1/auth/signup" do
    post "Sign up" do
      tags "Auth"
      consumes "application/json"
      parameter name: :params, in: :body, schema: {
        type: :object,
        properties: {
          name: { type: :string },
          email: { type: :string },
          phone_number: { type: :string },
          password: { type: :string },
          password_confirmation: { type: :string }
        },
        required: %w[name email phone_number password password_confirmation]
      }
      response "201", "created" do
        run_test!
      end
    end
  end

  path "/api/v1/auth/login" do
    post "Login" do
      tags "Auth"
      consumes "application/json"
      parameter name: :params, in: :body, schema: {
        type: :object,
        properties: { email: { type: :string }, password: { type: :string } },
        required: %w[email password]
      }
      response "200", "ok" do
        run_test!
      end
    end
  end
end
