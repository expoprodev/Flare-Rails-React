# frozen_string_literal: true

json.array! @codes.sort_by { |c| c[:label] }, partial: "consumer/code", as: :code
