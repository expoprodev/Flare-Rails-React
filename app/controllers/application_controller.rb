# frozen_string_literal: true

class ApplicationController < ActionController::Base

  impersonates :user
  # protect_from_forgery unless: -> { request.format.json? }
  respond_to :json, :html
  before_action :authenticate_user!
  before_action :check_requirements
  layout :layout

  def layout
    if current_user && current_user.company.locations.blank?
      "plain"
    elsif current_user
      "application"
    else
      "login"
    end
  end

  def check_requirements
    if current_user
      if current_user.company.locations.blank? &&
         params[:action] != "first_location" && params[:action] != "create"
        redirect_to :first_location_path
      end
    end
  end
end
