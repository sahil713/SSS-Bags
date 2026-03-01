# frozen_string_literal: true

Rails.application.routes.draw do
  mount Sidekiq::Web => "/sidekiq" if defined?(Sidekiq::Web)

  namespace :api do
    namespace :v1 do
      post "auth/signup", to: "auth#signup"
      post "auth/login", to: "auth#login"
      post "auth/refresh", to: "auth#refresh"
      post "auth/verify_email", to: "auth#verify_email"
      post "auth/resend_email_verification", to: "auth#resend_email_verification"
      post "auth/send_otp", to: "auth#send_otp"
      post "auth/verify_otp", to: "auth#verify_otp"

      resources :products, only: %i[index show], param: :slug do
        get :search, on: :collection
      end
      resources :categories, only: %i[index show], param: :slug
      get "banners", to: "banners#index"
      get "announcements", to: "announcements#index"

      namespace :customer do
        get "profile", to: "profile#show"
        patch "profile", to: "profile#update"
        resources :cart, only: %i[index create update destroy] do
          delete :clear, on: :collection
        end
        resources :addresses, only: %i[index create update destroy]
        resources :orders, only: %i[index show create] do
          get :track, on: :member
          post :cancel, on: :member
        end

        scope :investments do
          get "document_types", to: "investments#document_types"
          get "parsed_summary", to: "investments#parsed_summary"
          post "build_portfolio_from_documents", to: "investments#build_portfolio_from_documents"
          get "investing_opportunities", to: "investments#investing_opportunities"
          get "dashboard", to: "investments#dashboard"
          get "portfolio", to: "investments#portfolio"
          post "sync", to: "investments#sync"
          get "reports", to: "investments#reports"
          get "reports/export", to: "investments#export_report"
          get "sell_timing", to: "investments#sell_timing"
          get "tips", to: "investments#tips"
          resources :holdings, only: %i[index show create update destroy]
          resources :investment_pnl_records, only: %i[index show create update destroy], path: "pnl_records"
          resources :investment_tax_records, only: %i[index show create update destroy], path: "tax_records"
          resources :investment_transactions, only: %i[index show create update destroy], path: "transactions"
          resources :portfolio_snapshots, only: %i[index show create update destroy], path: "snapshots"
          resources :portfolio_statements, only: %i[index show create update] do
            post :retry_parse, on: :member
          end
          resources :investment_strategies, only: %i[index show create update destroy]
          resource :groww_connection, only: %i[show destroy], controller: "groww_connections"
        end
      end

      namespace :admin do
        resources :dashboard, only: [:index]
        post "uploads", to: "uploads#create"
        resources :users, only: %i[index show update]
        resources :categories, only: %i[index create update destroy], param: :slug
        resources :products, only: %i[index show create update destroy], param: :slug do
          member do
            patch :toggle_status
          end
        end
        resources :orders, only: %i[index show update] do
          member do
            patch :update_status
          end
        end
        resources :payments, only: %i[index show]
        resources :banners, only: %i[index show create update destroy] do
          member do
            patch :activate
          end
        end
        resources :announcements, only: %i[index show create update destroy] do
          member do
            patch :activate
          end
        end
      end

      namespace :webhooks do
        post "payments", to: "payments#create"
      end
    end
  end

  mount Rswag::Ui::Engine => "api-docs"
  mount Rswag::Api::Engine => "api-docs"
end
