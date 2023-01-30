# frozen_string_literal: true

class SessionsController < Devise::SessionsController
  skip_before_action :verify_authenticity_token
  def create
    resource = User.find_for_database_authentication(email: params[:user][:email])
    return invalid_login_attempt unless resource

    if resource.valid_password?(params[:user][:password])
      sign_in :user, resource
      return render  json: { success: true }, status: 201
    end

    invalid_login_attempt
   end

   protected
     def invalid_login_attempt
       set_flash_message(:alert, :invalid)
       render json: { success:false, error: flash[:alert] }, status: 401
     end
end
