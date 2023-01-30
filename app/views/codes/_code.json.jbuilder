# frozen_string_literal: true

json.extract! code, :id, :code, :label, :status
json.url code_url(code, format: :json)
