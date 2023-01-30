json.extract! location, :id, :name, :address, :address_ext, :city, :state, :zip, :stripe_location_id, :created_at, :updated_at
json.url location_url(location, format: :json)
