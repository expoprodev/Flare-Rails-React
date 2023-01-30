# frozen_string_literal: true

class ConsumerController < PublicController
  def codes
    @codes = Location.find_by_uuid(params[:id]).codes
  end

  def grouped_codes
    locations =
      Location.find_by_uuid(params[:id]).codes.group_by do |c|
        c.group ? c.group.name : "Default"
      end

    defaults =
      DefaultCode.includes(:default_group).map do |x|
        {
          id: x.id,
          label: x.name,
          default_group_id: x.default_group_id,
          default_group_name: x.default_group.name
        }
      end.group_by { |x| x[:default_group_name] }
    render json: locations.merge(defaults)
  end

  def nearby_locations
    render json:
             Location.search_nearby_locations(
               params[:lat].to_f,
               params[:long].to_f
             )
  end

  def nearby_places_by_name
    @client = GooglePlaces::Client.new(ENV["GOOGLE_API_KEY"])
    Rails.logger.info params[:query]
    Rails.logger.info params
    res =
      @client.predictions_by_input(
        params[:query],
        lat: params[:lat].to_f,
        lng: params[:lng].to_f,
        radius: 3000,
        strictbounds: true,
        types: "establishment",
        language: I18n.locale
      )

    places = res.map { |p| { place_id: p.place_id, name: p.description } }
    render json: places
  end

  def create_location_from_place
    # @client = GooglePlaces::Client.new(ENV['GOOGLE_API_KEY'])
    # render json: Location.search_nearby_locations(params[:lat].to_f, params[:long].to_f)
    place_id = params[:place_id]

    if !Location.find_by_place_id(place_id)
      @client = GooglePlaces::Client.new(ENV["GOOGLE_API_KEY"])
      place = @client.spot(place_id)
      @company =
        Company.create(name: place.name, industry: place.types.join(", "))
      # @company.save

      @location =
        Location.new(
          company_id: @company.id,
          name: place.name,
          lat: place.lat,
          lng: place.lng,
          metadata: place,
          place_id: place.place_id
        )
      @location.save(validate: false)
      Location.import
    else
      @location = Location.find_by_place_id(place_id)
    end
    render json: { success: true, location: Location.find(@location.id) }
  end

  def report
    location = Location.find_by_uuid(params[:location_id])
    if params[:type] == "default"
      Incident.create(
        reported_by_phone: "app",
        notes: params[:notes],
        reported_by_name: "app",
        location_id: location.id,
        default_code_id: params[:id]
      )
      # send notifications
      location.company.users.each do |user|
        next unless user.push_notifications

        user.devices.each do |device|
          device.notify_default_code(params[:id], location)
        end
      end
    else
      code = Code.find_by_uuid(params[:id])
      code.status = Code::DOWN
      code.save

      code.incidents.create(
        reported_by_phone: "app",
        notes: params[:notes],
        reported_by_name: "app",
        location_id: location.id
      )

      code.company.users.each do |user|
        next unless user.push_notifications

        user.devices.each { |device| device.notify_machine_down(code) }
      end
    end

    render json: { success: true }
  end

  def customer_portal
    # Authenticate your customer.
    if params[:email].blank?
      redirect_to "https://crowdflare.app", allow_other_host: true
    else
      # membership = Membership.find_by_email(params[:email])
      membership = Membership.where("email ILIKE ?", params[:email]).first
      if membership.blank?
        redirect_to "https://crowdflare.app", allow_other_host: true
      else
        session = Stripe::BillingPortal::Session.create({
          customer: membership.stripe_customer_id,
          return_url: "https://cidercade.com",
        }, { stripe_account: Company.find(4).stripe_user_id })

        redirect_to session.url, allow_other_host: true
      end
    end
  end

  def self_signup
    session = Stripe::Checkout::Session.create({
      success_url: "https://crowdflare.app",
      cancel_url: "https://crowdflare.app",
      line_items: [
        { price: params[:plan_id], quantity: 1 },
      ],
      mode: "subscription",
    }, { stripe_account: Company.find(params[:id]).stripe_user_id })
    redirect_to session.url, allow_other_host: true
  end
end
