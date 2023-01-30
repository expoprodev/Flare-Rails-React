class TaxRatesController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_tax_rate, only: %i[show edit update destroy]

  # GET /tax_rates
  # GET /tax_rates.json
  def index
    @tax_rates = current_user.default_location.tax_rates
  end

  # GET /tax_rates/1
  # GET /tax_rates/1.json
  def show; end

  # GET /tax_rates/new
  def new
    @tax_rate = TaxRate.new
  end

  # GET /tax_rates/1/edit
  def edit; end

  # POST /tax_rates
  # POST /tax_rates.json
  def create
    display_name = tax_rate_params[:display_name]
    percentage = tax_rate_params[:percentage]
    description = tax_rate_params[:description]
    inclusive = tax_rate_params[:inclusive] || false
    default = tax_rate_params[:default] || false

    to_stripe = {}

    to_stripe[:display_name] = display_name if display_name.present?
    to_stripe[:description] = description if description.present?
    to_stripe[:percentage] = percentage if percentage.present?
    to_stripe[:inclusive] = inclusive


    if default
      current_user.default_location.tax_rates.update_all(default: false)
    end

    stripe_metadata = Stripe::TaxRate.create(to_stripe, { stripe_account: current_user.company.stripe_user_id })

    @tax_rate = current_user.default_location.tax_rates.new(tax_rate_params)
    @tax_rate.stripe_metadata = stripe_metadata

    respond_to do |format|
      if @tax_rate.save
        format.html { redirect_to @tax_rate, notice: "Tax rate was successfully created." }
        format.json { render :show, status: :created, location: @tax_rate }
      else
        format.html { render :new }
        format.json { render json: @tax_rate.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /tax_rates/1
  # PATCH/PUT /tax_rates/1.json
  def update
    display_name = tax_rate_params[:display_name]
    percentage = tax_rate_params[:percentage]
    description = tax_rate_params[:description]
    inclusive = tax_rate_params[:inclusive] || false
    default = tax_rate_params[:default] || false

    if default
      current_user.default_location.tax_rates.update_all(default: false)
    end

    Stripe::TaxRate.update(
      @tax_rate.stripe_metadata.id, {
        display_name: display_name, description: description
      }, { stripe_account: current_user.company.stripe_user_id }
    )
    respond_to do |format|
      if @tax_rate.update({
                            display_name: display_name, description: description, default: default
                          })
        format.html { redirect_to @tax_rate, notice: "Tax rate was successfully updated." }
        format.json { render :show, status: :ok, location: @tax_rate }
      else
        format.html { render :edit }
        format.json { render json: @tax_rate.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /tax_rates/1
  # DELETE /tax_rates/1.json
  def destroy
    Stripe::TaxRate.update(
      @tax_rate.stripe_metadata.id, {
        active: false
      }, { stripe_account: current_user.company.stripe_user_id }
    )
    @tax_rate.destroy
    respond_to do |format|
      format.html { render json: { success: true }, notice: "Tax rate was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_tax_rate
      @tax_rate = TaxRate.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def tax_rate_params
      params.fetch(:tax_rate, {}).permit(
        :display_name,
        :percentage,
        :description,
        :inclusive,
        :default
      )
    end
end
