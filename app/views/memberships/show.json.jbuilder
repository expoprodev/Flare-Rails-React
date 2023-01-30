
 json.membership @membership
 json.additional_members @membership.additional_members.to_a
 json.stripe_membership @stripe_membership
 json.payment_methods @payment_methods
 json.stripe_location_id current_user.default_location.stripe_location_id
 json.audits @audits
 json.plans @plans.order(:default, :name)
 json.tax_rates @tax_rates.order(:default, :display_name)
 json.coupons @coupons.order(:name)
 json.charges @charges
 json.checkins @checkins
 json.location_name @membership.location.name
 json.location_id @membership.location.id
 json.locations current_user.company.locations
