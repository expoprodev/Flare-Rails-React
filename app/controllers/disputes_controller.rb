class DisputesController < ApplicationController
  # before_action :set_dispute, only: %i[ show edit update destroy ]

  # GET /disputes or /disputes.json
  def index
    @disputes = Stripe::Dispute.list({ limit: 100 }, { stripe_account: current_user.company.stripe_user_id }).data
    Rails.logger.info @disputes.as_json
  end



  private
    # Only allow a list of trusted parameters through.
    def dispute_params
      params.fetch(:dispute, {})
    end
end
