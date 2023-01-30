# frozen_string_literal: true

class CustomersController < ApplicationController
  def index
    # @customers = current_user.company.incidents.down
    @customers =
      current_user.default_location.incidents.group_by(&:reported_by_phone)
                  .map do |k, v|
        {
          count: v.count,
          phone: k,
          name: v.first.reported_by_name,
          last_reported: v.max_by(&:created_at).created_at
        }
      end
  end
end
