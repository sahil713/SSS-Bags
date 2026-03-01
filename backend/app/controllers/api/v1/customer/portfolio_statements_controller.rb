# frozen_string_literal: true

module Api
  module V1
    module Customer
      class PortfolioStatementsController < InvestmentsBaseController
        def create
          permitted = params.permit(:broker, :statement_date, :document_type, :document_sub_type, :file)
          return render json: { error: "No file provided" }, status: :unprocessable_entity unless permitted[:file]
          ext = File.extname(permitted[:file].original_filename.to_s).downcase
          return render json: { error: "Only PDF and XLSX files are supported" }, status: :unprocessable_entity unless [".pdf", ".xlsx"].include?(ext)

          # Auto-detect document type from filename if not provided
          doc_type, sub_type = GrowwFilenameDetector.detect(permitted[:file].original_filename)
          doc_type = permitted[:document_type].presence || doc_type || "holdings"
          sub_type = permitted[:document_sub_type].presence || sub_type || "stocks"

          statement = current_user.portfolio_statements.build(
            broker: permitted[:broker] || "Groww",
            statement_date: permitted[:statement_date],
            document_type: doc_type,
            document_sub_type: sub_type,
            parse_status: "pending"
          )
          statement.file.attach(permitted[:file])

          if statement.save
            ParsePortfolioPdfJob.perform_now(statement.id)
            statement.reload
            render json: {
              id: statement.id,
              message: "Document uploaded and parsed.",
              parse_status: statement.parse_status
            }, status: :created
          else
            render json: { errors: statement.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def index
          statements = current_user.portfolio_statements.order(created_at: :desc).limit(50)
          render json: {
            statements: statements.map { |s| statement_summary_json(s) }
          }
        end

        def show
          statement = current_user.portfolio_statements.find(params[:id])
          render json: statement_detail_json(statement)
        end

        def update
          statement = current_user.portfolio_statements.find(params[:id])
          permitted = params.permit(:parse_status, :document_type, :document_sub_type, :broker, :statement_date)
          if statement.update(permitted)
            render json: statement_summary_json(statement.reload)
          else
            render json: { errors: statement.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def retry_parse
          statement = current_user.portfolio_statements.find(params[:id])
          ParsePortfolioPdfJob.perform_now(statement.id)
          statement.reload
          render json: statement_summary_json(statement)
        end

        private

        def statement_summary_json(s)
          {
            id: s.id,
            broker: s.broker,
            statement_date: s.statement_date,
            document_type: s.document_type,
            document_sub_type: s.document_sub_type,
            parse_status: s.parse_status,
            created_at: s.created_at
          }
        end

        def statement_detail_json(s)
          {
            id: s.id,
            broker: s.broker,
            statement_date: s.statement_date,
            document_type: s.document_type,
            document_sub_type: s.document_sub_type,
            parse_status: s.parse_status,
            parsed_holdings: s.parsed_holdings,
            parsed_data: s.parsed_data,
            created_at: s.created_at
          }
        end
      end
    end
  end
end
