json.extract! plan, :id, :name, :interval, :amount, :default, :stripe_plan_id, :created_at, :updated_at
json.url plan_url(plan, format: :json)
