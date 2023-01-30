# frozen_string_literal: true

json.extract! company, :id, :name, :address, :address_ext, :city, :state, :zip,
              :program_code, :created_at, :updated_at
json.url company_url(company, format: :json)
