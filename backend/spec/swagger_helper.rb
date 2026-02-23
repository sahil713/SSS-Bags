# frozen_string_literal: true

require "rails_helper"

RSpec.configure do |config|
  config.openapi_root = Rails.root.join("swagger").to_s
  config.openapi_specs = {
    "v1/swagger.yaml" => {
      openapi: "3.0.1",
      info: {
        title: "SSS BAGS API",
        version: "v1",
        description: "E-commerce API for SSS BAGS"
      },
      paths: {},
      servers: [{ url: "http://localhost:3000", variables: { defaultHost: { default: "http://localhost:3000" } } }]
    }
  }
  config.openapi_format = :yaml
end
