# frozen_string_literal: true

class RegistrationsController < Devise::RegistrationsController
  layout "login"

  def create
    name = sign_up_params[:company_name]
    industry = sign_up_params[:industry] || ""
    @company = Company.new(name: name, industry: industry)
    @company.save

    address = sign_up_params[:address]
    address_ext = sign_up_params[:address_ext]
    city = sign_up_params[:city]
    state = sign_up_params[:state]
    zip = sign_up_params[:zip]
    country = "US"

    stripe_location =
      Stripe::Terminal::Location.create(
        {
          display_name: name,
          address: {
            line1: address,
            line2: address_ext,
            city: city,
            country: "US",
            postal_code: zip
          }
        }
      )

    @location =
      Location.new(
        company_id: @company.id,
        name: name,
        stripe_location_id: stripe_location.id,
        lat: 0,
        lng: 0
      )

    @location.save(validate: false)

    build_resource(sign_up_params)
    Rails.logger.info resource
    resource.company = @company
    resource.default_location_id = @location.id
    resource.role = "admin"

    if resource.save
      if resource.active_for_authentication?
        set_flash_message :notice, :signed_up if is_navigational_format?
        sign_up(resource_name, resource)
        respond_with resource, location: after_sign_up_path_for(resource)
      else
        if is_navigational_format?
          set_flash_message :notice,
                            :"signed_up_but_#{resource.inactive_message}"
        end
        expire_data_after_sign_in!
        respond_with resource,
                     location: after_inactive_sign_up_path_for(resource)
      end
    else
      clean_up_passwords resource
      respond_with resource
    end
  end

  private
    def sign_up_params
      params.require(:user).permit(
        :name,
        :company_name,
        :industry,
        :email,
        :password,
        :password_confirmation,
        :address,
        :address_ext,
        :city,
        :state,
        :zip
      )
    end

  protected
    def after_update_path_for(_resource)
      "/?" + { user_updated: true }.to_query
    end
end
