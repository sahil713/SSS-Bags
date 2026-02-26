# frozen_string_literal: true

module Api
  module V1
    module Admin
      class AnnouncementsController < BaseController
        before_action :set_announcement, only: %i[show update destroy activate]

        def index
          announcements = Announcement.unscoped.not_deleted.order(created_at: :desc)
          render json: { announcements: announcements.map { |a| admin_announcement_json(a) } }
        end

        def show
          authorize @announcement
          render json: admin_announcement_json(@announcement)
        end

        def create
          announcement = Announcement.new(announcement_params)
          authorize announcement
          if announcement.save
            render json: admin_announcement_json(announcement), status: :created
          else
            render json: { errors: announcement.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          authorize @announcement
          if @announcement.update(announcement_params)
            render json: admin_announcement_json(@announcement)
          else
            render json: { errors: @announcement.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          authorize @announcement
          @announcement.soft_delete
          head :no_content
        end

        def activate
          authorize @announcement
          @announcement.update!(is_active: !@announcement.is_active)
          render json: admin_announcement_json(@announcement)
        end

        private

        def set_announcement
          @announcement = Announcement.unscoped.not_deleted.find(params[:id])
        end

        def announcement_params
          params.permit(:message, :is_active, :background_color, :text_color, :start_date, :end_date, :link)
        end

        def admin_announcement_json(a)
          {
            id: a.id,
            message: a.message,
            is_active: a.is_active,
            background_color: a.background_color,
            text_color: a.text_color,
            link: a.link,
            start_date: a.start_date,
            end_date: a.end_date,
            created_at: a.created_at,
            updated_at: a.updated_at
          }
        end
      end
    end
  end
end
