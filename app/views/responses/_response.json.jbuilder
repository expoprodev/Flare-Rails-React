json.extract! response, :id, :message, :is_default, :created_at, :updated_at
json.url response_url(response, format: :json)
