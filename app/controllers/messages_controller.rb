# frozen_string_literal: true

class MessagesController < ApplicationController
  def index
    @messages =
      current_user.company.incoming_messages.order("created_at DESC").limit(50)
  end
end
