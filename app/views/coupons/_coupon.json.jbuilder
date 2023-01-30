json.extract! coupon, :id, :name, :percent_off, :amount_off, :duration, :duration_in_months, :created_at, :updated_at
json.url coupon_url(coupon, format: :json)
