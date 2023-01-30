class CouponsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_coupon, only: %i[show edit update destroy]

  # GET /coupons
  # GET /coupons.json
  def index
    @coupons = current_user.default_location.coupons
  end

  # GET /coupons/1
  # GET /coupons/1.json
  def show; end

  # GET /coupons/new
  def new
    @coupon = Coupon.new
  end

  # GET /coupons/1/edit
  def edit; end

  # POST /coupons
  # POST /coupons.json
  def create
    @coupon = current_user.default_location.coupons.new(coupon_params)
    percent_off = coupon_params[:percent_off]
    amount_off = coupon_params[:amount_off]
    duration_in_months = coupon_params[:duration_in_months]
    duration = coupon_params[:duration]
    name = coupon_params[:name]

    to_stripe = {}
    to_stripe[:name] = name
    to_stripe[:percent_off] = percent_off.to_f if percent_off.present?
    to_stripe[:amount_off] = amount_off.to_i if amount_off.present?
    to_stripe[:duration] = duration if duration.present?
    to_stripe[:duration_in_months] = duration_in_months.to_i if duration_in_months.present?
    to_stripe[:currency] = "usd" if amount_off.present?

    metadata = Stripe::Coupon.create(to_stripe, { stripe_account: current_user.company.stripe_user_id })

    @coupon.stripe_metadata = metadata

    respond_to do |format|
      if @coupon.save
        format.html { redirect_to @coupon, notice: "Coupon was successfully created." }
        format.json { render :show, status: :created, location: @coupon }
      else
        format.html { render :new }
        format.json { render json: @coupon.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /coupons/1
  # PATCH/PUT /coupons/1.json
  def update
    metadata = Stripe::Coupon.update(
      @coupon.stripe_metadata.id,
      { name: coupon_params[:name] },
      { stripe_account: current_user.company.stripe_user_id }
    )
    coupon_params[:stripe_metadata] = metadata
    respond_to do |format|
      if @coupon.update(coupon_params)
        format.html { redirect_to @coupon, notice: "Coupon was successfully updated." }
        format.json { render :show, status: :ok, location: @coupon }
      else
        format.html { render :edit }
        format.json { render json: @coupon.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /coupons/1
  # DELETE /coupons/1.json
  def destroy
    Rails.logger.info "HERE IN DESTROY"
    Stripe::Coupon.delete(
      @coupon.stripe_metadata.id, {}, { stripe_account: current_user.company.stripe_user_id }
    )
    @coupon.destroy
    respond_to do |format|
      format.html { render json: { success: true }, notice: "Coupon was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_coupon
      @coupon = Coupon.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def coupon_params
      params.fetch(:coupon, {}).permit(:name, :amount_off, :percent_off, :duration, :duration_in_months)
    end
end
