class SettingsController < ApplicationController
  authorize_resource class: false

  def index
    @company = current_user.company
  end

  def search_phone_number
    @search = params[:search] ? params[:search][:search] : ""
    client = Twilio::REST::Client.new

    @numbers =
      client.api.available_phone_numbers("US").local.list(area_code: @search)
  end

  def choose_number
    client = Twilio::REST::Client.new
    number = params[:number]

    client.incoming_phone_numbers.create(
      phone_number: number,
      sms_url: "https://dashboard.crowdflare.app/sms",
      sms_method: "POST"
    )

    company = current_user.company
    company.program_code = number
    company.save

    redirect_to settings_path(company)
  end
end
