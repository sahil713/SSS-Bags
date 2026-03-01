# frozen_string_literal: true

require "net/http"
require "json"

class GrowwPortfolioService
  GROWW_API_BASE = "https://api.groww.in/v1".freeze

  class << self
    def fetch_holdings(connection)
      return { success: false, error: "Connection not linked" } unless connection&.linked?
      return { success: false, error: "API key required" } if connection.api_key.blank?

      token = get_access_token(connection)
      return token if token.is_a?(Hash) && !token[:success]

      holdings = fetch_from_groww("#{GROWW_API_BASE}/holdings/user", token)
      return holdings if holdings.is_a?(Hash) && holdings[:success] == false

      positions = fetch_from_groww("#{GROWW_API_BASE}/positions/user", token)
      return positions if positions.is_a?(Hash) && positions[:success] == false

      # Groww may return holdings in different formats - normalize
      holdings_data = normalize_holdings(holdings)
      positions_data = normalize_positions(positions)

      combined = (holdings_data + positions_data).compact
      totals = compute_totals(combined)

      {
        success: true,
        holdings: combined,
        total_value: totals[:total_value],
        total_pnl: totals[:total_pnl],
        total_pnl_percent: totals[:total_pnl_percent]
      }
    rescue StandardError => e
      Rails.logger.error("GrowwPortfolioService error: #{e.message}")
      { success: false, error: e.message }
    end

    private

    def get_access_token(connection)
      # If api_key looks like a JWT (Access Token), use directly
      token = connection.api_key.to_s.strip
      return token if token.start_with?("eyJ") && token.length > 100

      # Otherwise try API Key + Secret exchange
      return token if connection.secret.blank?

      uri = URI("#{GROWW_API_BASE}/token/api/access")
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.open_timeout = 10
      http.read_timeout = 15

      timestamp = Time.now.to_i.to_s
      checksum = OpenSSL::HMAC.hexdigest("SHA256", connection.secret, timestamp)

      request = Net::HTTP::Post.new(uri)
      request["Authorization"] = "Bearer #{token}"
      request["Content-Type"] = "application/json"
      request.body = { key_type: "approval", checksum: checksum, timestamp: timestamp }.to_json

      response = http.request(request)

      if response.code.to_i == 200
        body = JSON.parse(response.body).deep_symbolize_keys
        body[:token] || body[:access_token]
      else
        { success: false, error: "Failed to get Groww access token" }
      end
    rescue StandardError => e
      Rails.logger.error("Groww token exchange error: #{e.message}")
      { success: false, error: "Token exchange failed: #{e.message}" }
    end

    def fetch_from_groww(url, token)
      uri = URI(url)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.open_timeout = 10
      http.read_timeout = 15

      request = Net::HTTP::Get.new(uri)
      request["Accept"] = "application/json"
      request["Authorization"] = "Bearer #{token}"
      request["X-API-VERSION"] = "1.0"

      response = http.request(request)

      case response.code.to_i
      when 200
        body = response.body.presence && JSON.parse(response.body)
        body.is_a?(Hash) ? body.deep_symbolize_keys : body
      when 401
        { success: false, error: "Invalid or expired Groww token. Please re-link your account." }
      when 403
        { success: false, error: "Access denied. Check your Groww API permissions." }
      else
        { success: false, error: "Groww API error: #{response.code}" }
      end
    rescue JSON::ParserError
      { success: false, error: "Invalid response from Groww" }
    end

    def normalize_holdings(data)
      return [] if data.blank?

      # Groww may return { data: [...] }, { holdings: [...] }, or direct array
      list = if data.is_a?(Array)
        data
      elsif data.is_a?(Hash)
        data[:data] || data[:holdings] || data[:equity] || data[:mf] || []
      else
        []
      end
      list = [list] if list.is_a?(Hash)

      list.map do |h|
        h = h.deep_symbolize_keys if h.respond_to?(:deep_symbolize_keys)
        qty = (h[:quantity] || h[:net_quantity] || h[:demat_free_quantity] || 0).to_f
        avg = (h[:average_price] || h[:avg_price] || 0).to_f
        curr = (h[:current_price] || h[:last_price] || avg).to_f
        value = (h[:current_value] || h[:value] || (qty * curr)).to_f
        cost = qty * avg
        pnl = value - cost
        pnl_pct = cost.positive? ? (pnl / cost * 100) : 0

        {
          symbol: h[:trading_symbol] || h[:symbol] || h[:isin],
          isin: h[:isin],
          quantity: qty,
          avg_price: avg,
          current_price: curr,
          value: value,
          pnl: pnl,
          pnl_percent: pnl_pct,
          type: h[:segment] || h[:type] || "equity"
        }
      end
    end

    def normalize_positions(data)
      return [] if data.blank?

      list = data.is_a?(Array) ? data : (data[:data] || data[:positions] || [])
      list = [list] if list.is_a?(Hash)

      list.map do |p|
        p = p.deep_symbolize_keys if p.respond_to?(:deep_symbolize_keys)
        qty = (p[:quantity] || p[:net_quantity] || 0).to_f
        avg = (p[:average_price] || p[:net_price] || 0).to_f
        curr = (p[:current_price] || p[:last_price] || avg).to_f
        value = (qty * curr).to_f
        cost = qty * avg
        pnl = (p[:realised_pnl] || p[:unrealised_pnl] || (value - cost)).to_f
        pnl_pct = cost.positive? ? (pnl / cost * 100) : 0

        {
          symbol: p[:trading_symbol] || p[:symbol] || p[:isin],
          isin: p[:isin],
          quantity: qty,
          avg_price: avg,
          current_price: curr,
          value: value,
          pnl: pnl,
          pnl_percent: pnl_pct,
          type: p[:segment] || "fno"
        }
      end
    end

    def compute_totals(holdings)
      total_value = holdings.sum { |h| h[:value].to_f }
      total_pnl = holdings.sum { |h| h[:pnl].to_f }
      total_cost = holdings.sum { |h| (h[:quantity].to_f * h[:avg_price].to_f) }
      total_pnl_percent = total_cost.positive? ? (total_pnl / total_cost * 100) : 0

      {
        total_value: total_value.round(2),
        total_pnl: total_pnl.round(2),
        total_pnl_percent: total_pnl_percent.round(2)
      }
    end
  end
end
