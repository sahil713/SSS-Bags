# frozen_string_literal: true

module Api
  module V1
    module Customer
      class AddressesController < BaseController
        before_action :set_address, only: %i[update destroy]

        def index
          render json: { addresses: current_user.addresses.map { |a| address_json(a) } }
        end

        def create
          address = current_user.addresses.build(address_params)
          if address.save
            render json: address_json(address), status: :created
          else
            render json: { errors: address.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          if @address.update(address_params)
            render json: address_json(@address)
          else
            render json: { errors: @address.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          @address.destroy
          head :no_content
        end

        private

        def set_address
          @address = current_user.addresses.find(params[:id])
        end

        def address_params
          params.permit(:label, :line1, :line2, :city, :state, :pincode, :phone, :default)
        end

        def address_json(a)
          { id: a.id, label: a.label, line1: a.line1, line2: a.line2, city: a.city, state: a.state, pincode: a.pincode, phone: a.phone, default: a.default?, full_address: a.full_address }
        end
      end
    end
  end
end
