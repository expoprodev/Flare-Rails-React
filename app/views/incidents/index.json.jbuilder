# frozen_string_literal: true

json.array! @incidents.sort_by { |c| c[:created_at] }.reverse, partial: "incidents/incident", as: :incident
