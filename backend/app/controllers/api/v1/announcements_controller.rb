# frozen_string_literal: true

module Api
  module V1
    class AnnouncementsController < BaseController
      skip_before_action :authenticate_user!, only: [:index]

      def index
        announcements = Announcement.active_for_public
        render json: { announcements: announcements.map { |a| announcement_json(a) } }
      end

      private

      def announcement_json(a)
        {
          id: a.id,
          message: a.message,
          background_color: a.background_color,
          text_color: a.text_color,
          link: a.link,
          start_date: a.start_date,
          end_date: a.end_date
        }
      end
    end
  end
end
