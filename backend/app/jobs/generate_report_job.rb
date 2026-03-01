# frozen_string_literal: true

class GenerateReportJob < ApplicationJob
  queue_as :default

  def perform(user_id, report_type = "monthly")
    user = User.find_by(id: user_id)
    return unless user

    # Stub - generate PDF/CSV report
    # TODO: Implement report generation
  end
end
