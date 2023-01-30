# frozen_string_literal: true

json.array! @messages.sort_by(&:created_at).reverse, partial: "messages/messages", as: :message
