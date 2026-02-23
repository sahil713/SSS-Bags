# frozen_string_literal: true

module Api
  module V1
    module Admin
      class UploadsController < BaseController
        ALLOWED_TYPES = %w[image/jpeg image/png image/gif image/webp].freeze
        MAX_SIZE = 10.megabytes

        def create
          file = params[:file]
          return render json: { error: "No file" }, status: :unprocessable_entity unless file.is_a?(ActionDispatch::Http::UploadedFile)

          unless ALLOWED_TYPES.include?(file.content_type)
            return render json: { error: "Invalid file type. Allowed: JPEG, PNG, GIF, WebP" }, status: :unprocessable_entity
          end
          if file.size > MAX_SIZE
            return render json: { error: "File too large (max 10MB)" }, status: :unprocessable_entity
          end

          blob = ActiveStorage::Blob.create_and_upload!(
            io: file,
            filename: file.original_filename,
            content_type: file.content_type
          )
          render json: { signed_id: blob.signed_id, url: Rails.application.routes.url_helpers.rails_blob_url(blob, host: request.base_url) }
        end
      end
    end
  end
end
