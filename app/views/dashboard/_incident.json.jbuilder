# frozen_string_literal: true

json.extract! incident, :created_at, :message, :notes, :status
# json.url code_url(incident.code, format: :json)
