# frozen_string_literal: true

class BillingController < ApplicationController
  authorize_resource class: false

  def index
    @company = current_user.company
    @charges = if !@company.stripe_customer.blank?
      Stripe::Charge.list(customer: @company.stripe_customer[:id])
    else
      []
    end

    @connected_account = {}
    @connected_account = Stripe::Account.retrieve(@company.stripe_user_id) if @company.stripe_user_id

    respond_to do |format|
      format.html
      format.json { render :index, status: :ok }
    end
  end

  def invoices
    @company = current_user.company

    respond_to do |format|
      format.html { render json: { success: true } }
    end
  end

  def stripe_connected
    code = params[:code]
    response = Stripe::OAuth.token({
                                     grant_type: "authorization_code",
                                     code: code
                                   })

    # Access the connected account id in the response
    connected_account_id = response.stripe_user_id
    company = current_user.company
    company.stripe_user_id = connected_account_id
    company.save

    redirect_to billing_path
  end
end
