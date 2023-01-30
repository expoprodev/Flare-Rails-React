json.company @company
json.connected_account @connected_account
json.stripe_connect_url ENV["STRIPE_EXPRESS"]
json.stripe_portal_url Stripe::Account.create_login_link(@company.stripe_user_id).url
