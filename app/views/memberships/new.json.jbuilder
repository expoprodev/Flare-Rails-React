 json.stripe_location_id current_user.default_location.stripe_location_id
 json.plans @plans.order(:default, :name)
 json.tax_rates @tax_rates.order(:default, :display_name)
 json.coupons @coupons.order(:name)
