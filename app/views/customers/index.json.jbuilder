# frozen_string_literal: true

json.array! @customers.sort_by { |c| c[:last_reported] }.reverse, partial: "customers/customer", as: :customer
