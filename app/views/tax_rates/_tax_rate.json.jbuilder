json.extract! tax_rate, :id, :display_name, :default, :description, :inclusive, :percentage, :created_at, :updated_at
json.url tax_rate_url(tax_rate, format: :json)
