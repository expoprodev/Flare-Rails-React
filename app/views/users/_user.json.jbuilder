# frozen_string_literal: true

json.extract! user, :id, :name, :email, :created_at, :updated_at, :company_id, :role, :default_location_id, :pin, :last_sign_in_at, :email_notifications, :push_notifications, :timezone
json.url user_url(user, format: :json)
