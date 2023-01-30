# frozen_string_literal: true

class CompaniesController < ApplicationController
  load_and_authorize_resource
  before_action :set_company, only: %i[show edit update destroy update_card]

  # GET /companies/1
  # GET /companies/1.json
  def show; end

  # GET /companies/1/edit
  def edit; end

  # POST /companies
  # POST /companies.json
  def create
    @company = Company.new(company_params)

    respond_to do |format|
      if @company.save
        format.html do
          redirect_to settings_path, notice: "Company was successfully created."
        end
        format.json { render :show, status: :created, location: @company }
      else
        format.html { render :new }
        format.json do
          render json: @company.errors, status: :unprocessable_entity
        end
      end
    end
  end

  # PATCH/PUT /companies/1
  # PATCH/PUT /companies/1.json
  def update
    respond_to do |format|
      if @company.update(company_params)
        format.html do
          redirect_to settings_path, notice: "Company was successfully updated."
        end
        format.json { render :show, status: :ok, location: @company }
      else
        format.html { render :edit }
        format.json do
          render json: @company.errors, status: :unprocessable_entity
        end
      end
    end
  end

  def company
    @company = current_user.company
  end

  def update_card
    if @company.stripe_customer.blank?
      cu =
        Stripe::Customer.create(
          description: "Customer for #{current_user.email}",
          source: card_params[:stripe_card_token] # obtained with Stripe.js
        )
    else
      cu = Stripe::Customer.retrieve(@company.stripe_customer[:id])
      cu.source = card_params[:stripe_card_token]
      cu.save
    end

    @company.stripe_customer = {
      id: cu.id,
      description: cu.description,
      default_source: cu.default_source,
      last4: cu.sources.data.first.last4,
      brand: cu.sources.data.first.brand
    }

    respond_to do |format|
      if @company.save
        format.html do
          redirect_to billing_path, notice: "Billing was successfully updated."
        end
        format.json { render :show, status: :ok, location: @company }
      else
        format.html { render :edit }
        format.json do
          render json: @company.errors, status: :unprocessable_entity
        end
      end
    end
  end

  # DELETE /companies/1
  # DELETE /companies/1.json
  def destroy
    @company.destroy
    respond_to do |format|
      format.html do
        redirect_to companies_url, notice: "Company was successfully destroyed."
      end
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_company
      @company = current_user.company
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def company_params
      params.require(:company).permit(
        :name,
        :address,
        :address_ext,
        :city,
        :state,
        :zip
      )
    end

    def card_params
      params.require(:company).permit(:stripe_card_token)
    end
end
