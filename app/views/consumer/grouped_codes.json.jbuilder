# frozen_string_literal: true

json.array! @codes.sort_by { |c| c[:name] }, partial: "consumer/code", as: :code
