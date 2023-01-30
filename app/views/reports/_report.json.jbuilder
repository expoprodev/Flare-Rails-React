json.extract! report, :id, :name, :status, :start_date, :end_date, :created_at, :updated_at
json.url report_url(report, format: :json)
