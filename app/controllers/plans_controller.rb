class PlansController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_plan, only: %i[show edit update destroy]

  # GET /plans
  # GET /plans.json
  def index
    @plans = current_user.default_location.plans
  end

  # GET /plans/1
  # GET /plans/1.json
  def show
    @stripe_plan = Stripe::Plan.retrieve @plan.stripe_plan_id, { stripe_account: current_user.company.stripe_user_id }
  end

  # GET /plans/new
  def new
    @plan = Plan.new
  end

  # GET /plans/1/edit
  def edit; end

  # POST /plans
  # POST /plans.json
  def create
    name = plan_params[:name]
    interval = plan_params[:interval]
    amount = plan_params[:amount]
    default = plan_params[:default] || false
    stripe_plan =
      Stripe::Plan.create(
        {
          amount_decimal: amount,
          currency: "usd",
          interval: interval,
          product: {
            name: name,
            statement_descriptor: "#{current_user.company.name} #{name}".truncate(22)
          },
          nickname: name
        }, { stripe_account: current_user.company.stripe_user_id }
      )
    if default
      current_user.default_location.plans.update_all(default: false)
    end
    @plan =
      current_user.default_location.plans.new(
        {
          name: name,
          stripe_plan_id: stripe_plan.id,
          interval: interval,
          amount: amount,
          default: default
        }
      )

    respond_to do |format|
      if @plan.save
        format.html do
          redirect_to @plan, notice: "Plan was successfully created."
        end
        format.json { render :show, status: :created, location: @plan }
      else
        format.html { render :new }
        format.json { render json: @plan.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /plans/1
  # PATCH/PUT /plans/1.json
  def update
    default = plan_params[:default] || false
    if default
      current_user.default_location.plans.update_all(default: false)
    end
    Stripe::Plan.update(@plan.stripe_plan_id, { nickname: plan_params[:name] }, { stripe_account: current_user.company.stripe_user_id })
    respond_to do |format|
      if @plan.update(plan_params)
        format.html do
          redirect_to @plan, notice: "Plan was successfully updated."
        end
        format.json { render :show, status: :ok, location: @plan }
      else
        format.html { render :edit }
        format.json { render json: @plan.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /plans/1
  # DELETE /plans/1.json
  def destroy
    Stripe::Plan.delete(@plan.stripe_plan_id, {},{ stripe_account: current_user.company.stripe_user_id })
    @plan.destroy
    respond_to do |format|
      format.html { render json: { success: true }, notice: "Coupon was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_plan
      @plan = Plan.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def plan_params
      params.require(:plan).permit(:name, :interval, :amount, :default)
    end
end
