class MembershipsController < ApplicationController
  skip_before_action :verify_authenticity_token

  before_action :set_membership,
                only: %i[
                  show
                  edit
                  update
                  destroy
                  cancel_cycle_end
                  reverse_cancel_cycle_end
                  detach_payment_method
                  attach_payment_method
                  attach_subscription
                  edit_subscription
                  refund
                  checkin
                  add_additional_member
                  remove_additional_member
                ]

  # GET /memberships
  # GET /memberships.json
  def index
    @memberships_total = current_user.default_location.memberships.count
  end

  # GET /memberships/1
  # GET /memberships/1.json
  def show
    @stripe_membership =
      Stripe::Customer.retrieve(@membership.stripe_customer_id,
                                { stripe_account: current_user.company.stripe_user_id })

    @payment_methods =
      Stripe::PaymentMethod.list(
        { customer: @membership.stripe_customer_id, type: "card" },
        { stripe_account: current_user.company.stripe_user_id }
      )

    @plans = current_user.default_location.plans
    @tax_rates = current_user.default_location.tax_rates
    @coupons = current_user.default_location.coupons
    @charges = Stripe::Charge.list({ customer: @membership.stripe_customer_id, limit: 100 }, { stripe_account: current_user.company.stripe_user_id })
    @checkins = @membership.checkins
    @audits = @membership.audits.select { |a| a[:user_id].present? }.map { |a| { user: a[:user_id] ? User.find(a[:user_id])&.name : "", action: a[:action], created_at: a[:created_at].to_i, comment: a[:comment] } }
  end

  # GET /memberships/new
  def new
    @membership = Membership.new
    @plans = current_user.default_location.plans
    @tax_rates = current_user.default_location.tax_rates
    @coupons = current_user.default_location.coupons
  end

  # GET /memberships/1/edit
  def edit
    @plans = current_user.default_location.plans
  end

  # POST /memberships
  # POST /memberships.json
  def create
    if membership_params[:skip_payment]=="false"
      payment_method = if membership_params[:payment_method_id].blank?
        Stripe::PaymentMethod.create(
          {
            type: "card",
            card: {
              number: membership_params[:card_number].to_i,
              exp_month: membership_params[:card_exp_month].to_i,
              exp_year: membership_params[:card_exp_year].to_i,
              cvc: membership_params[:card_cvc]
            }
          }, { stripe_account: current_user.company.stripe_user_id }
        )
      else
        { id: membership_params[:payment_method_id] }
      end
    end

    customer_payload = {
      name: membership_params[:name],
      email: membership_params[:email],
      phone: membership_params[:phone],

    }
    customer_payload[:payment_method] = payment_method[:id] if membership_params[:skip_payment] == "false"
    customer_payload[:invoice_settings] =  { default_payment_method: payment_method[:id] } if membership_params[:skip_payment]== "false"
    customer =
      Stripe::Customer.create(customer_payload, { stripe_account: current_user.company.stripe_user_id })
    Rails.logger.info customer


    sub_payload = {
      customer: customer.id,
      coupon: membership_params[:stripe_coupon_id],
      # default_payment_method: payment_method[:id],
      items: [
        {
          plan: membership_params[:stripe_plan_id],
          quantity: membership_params[:quantity]
        }
      ],

      default_tax_rates: [membership_params[:stripe_tax_rate_id]],
      application_fee_percent: 7,
      metadata: { location_id: current_user.default_location.id, location_name: current_user.default_location.name }
    }
    sub_payload[:default_payment_method] = payment_method[:id] if membership_params[:skip_payment]== "false"
    sub_payload[:trial_end] = (DateTime.strptime(membership_params[:trial_end], "%Y-%m-%d") + 1.day).to_i unless membership_params[:trial_end].blank?
    sub_payload[:cancel_at] = (DateTime.strptime(membership_params[:cancel_at], "%Y-%m-%d") + 1.day).to_i unless membership_params[:cancel_at].blank?

    stripe_subscription =
      Stripe::Subscription.create(
        sub_payload,
        { stripe_account: current_user.company.stripe_user_id }
      )
    @membership =
      current_user.default_location.memberships.new(
        email: membership_params[:email],
        name: membership_params[:name],
        last_name: membership_params[:last_name],
        full_name: "#{membership_params[:name]} #{membership_params[:last_name]}",
        phone: membership_params[:phone],
        stripe_customer_id: customer.id,
        stripe_plan_id: membership_params[:stripe_plan_id],
        stripe_subscription_metadata: stripe_subscription,
        quantity: membership_params[:quantity].to_i,
        notes: membership_params[:notes],
        audit_comment: "Created Member",
        signature: membership_params[:signature]
      )


    additional_members = membership_params[:additional_members] || []
    Rails.logger.info membership_params

    respond_to do |format|
      if @membership.save
        @membership.additional_members.create additional_members unless additional_members.blank?
        MembershipMailer.with(
          membership: @membership,
          confirm_details: {
            total: membership_params[:total],
            recurring: membership_params[:recurring],
            interval: membership_params[:interval]
          }
        ).welcome_email.deliver_later
        format.html do
          render json: { success: true },
                 notice: "Membership was successfully created."
        end
        format.json { render :show, status: :created, location: @membership }
      else
        format.html { render :new }
        format.json do
          render json: @membership.errors, status: :unprocessable_entity
        end
      end
    end
  rescue StandardError => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  # PATCH/PUT /memberships/1
  # PATCH/PUT /memberships/1.json
  def update
    sub_id = @membership.stripe_subscription_metadata.id
    item_id = @membership.stripe_subscription_metadata.items.data.first.id

    sub_payload = {
      items: [{
        id: item_id,
        quantity: membership_params[:quantity]
      }],
      proration_behavior: "none"
    }
    sub_payload[:trial_end] = (DateTime.strptime(membership_params[:trial_end], "%Y-%m-%d") + 1.day).to_i unless membership_params[:trial_end].blank?
    Stripe::Subscription.update(sub_id,
      sub_payload,
      { stripe_account: current_user.company.stripe_user_id }
    )



    respond_to do |format|
      if @membership.update(membership_params)
        format.html { render json: { success: true } }
        format.json { render :show, status: :ok, location: @membership }
      else
        format.html { render :edit }
        format.json do
          render json: @membership.errors, status: :unprocessable_entity
        end
      end
    end
  end

  # DELETE /memberships/1
  # DELETE /memberships/1.json
  def destroy
    # cancel memberships at end of cycle
    metadata = Stripe::Subscription.update(
      @membership.stripe_subscription_metadata.id,
      { cancel_at_period_end: true }, { stripe_account: current_user.company.stripe_user_id }
    )
    @membership.stripe_subscription_metadata = metadata
    @membership.audit_comment = "Canceled membership"
    @membership.save

    @membership.destroy
    respond_to do |format|
      format.html do
        render json: { success: true },
               notice: "Membership was successfully destroyed."
      end
      format.json { head :no_content }
    end
  end

  def cancel_cycle_end
    subscription_id = params[:subscription_id]
    metadata = Stripe::Subscription.update(
      # @membership.stripe_subscription_metadata.id,
      subscription_id,
      { cancel_at_period_end: true }, { stripe_account: current_user.company.stripe_user_id }
    )
    @membership.stripe_subscription_metadata = metadata
    @membership.audit_comment = "Canceled membership"
    @membership.save
    MembershipMailer.with(membership: @membership).cancel_subscription.deliver_later
    redirect_to action: "show", id: @membership.id
  end

  def reverse_cancel_cycle_end
    Rails.logger.info "reverse"
    Rails.logger.info @membership
    subscription_id = membership_params[:subscription_id]
    metadata = Stripe::Subscription.update(
      subscription_id,
      { cancel_at_period_end: false }, { stripe_account: current_user.company.stripe_user_id }
    )
    @membership.stripe_subscription_metadata = metadata
    @membership.audit_comment = "Reinstated membership"
    @membership.save
    redirect_to action: "show", id: @membership.id
  end

  def detach_payment_method
    payment_method_id = params[:payment_method_id]
    Stripe::PaymentMethod.detach(payment_method_id, nil, { stripe_account: current_user.company.stripe_user_id })

    redirect_to action: "show", id: @membership.id
  end

  def attach_payment_method
    payment_method_id = params[:payment_method_id]

    payment_method = if params[:payment_method_id].blank?
      Stripe::PaymentMethod.create(
        {
          type: "card",
          card: {
            number: params[:card_number].to_i,
            exp_month: params[:card_exp_month].to_i,
            exp_year: params[:card_exp_year].to_i,
            cvc: params[:card_cvc]
          }
        }, { stripe_account: current_user.company.stripe_user_id }
      )
    else
      { id: params[:payment_method_id] }
    end

    Stripe::PaymentMethod.attach(
      payment_method[:id],
      { customer: @membership.stripe_customer_id }, { stripe_account: current_user.company.stripe_user_id }
    )

    Stripe::Customer.update(
      @membership.stripe_customer_id,
      { invoice_settings: { default_payment_method: payment_method_id } }, { stripe_account: current_user.company.stripe_user_id }
    )

    redirect_to action: "show", id: @membership.id
  end

  def search
    query = params[:query]
    page = params[:page] ||= 1
    per_page = params[:per_page] ||= 10
    all = params[:all_loc] ||= "false"

    if all == "true"
      memberships = current_user.company.memberships.includes(:additional_members).references(:additional_members)
    else
      memberships = current_user.default_location.memberships.includes(:additional_members).references(:additional_members)
    end

    @memberships =
    memberships.where(
      "memberships.name ILIKE ?",
      "%#{query}%"
    ).or(
      memberships.where(
        "memberships.last_name ILIKE ?",
        "%#{query}%"
      )
    ).or(
      memberships.where(
        "memberships.full_name ILIKE ?",
        "%#{query}%"
      )
    ).or(
      memberships.where(
        "memberships.phone ILIKE ?",
        "%#{query}%"
      )
    ).or(
      memberships.where(
        "memberships.email ILIKE ?",
        "%#{query}%"
      )
    ).or(
      memberships.where(
        "memberships.last4 ILIKE ?",
        "%#{query}%"
      )
    ).or(
      memberships.where(
        "memberships.brand ILIKE ?",
        "%#{query}%"
      )
    ).or(
      memberships.where(
        "memberships.notes ILIKE ?",
        "%#{query}%"
      )
    ).or(
      memberships.where(
        "additional_members.name ILIKE ?",
        "%#{query}%"
      )
    ).or(
      memberships.where(
        "additional_members.phone ILIKE ?",
        "%#{query}%"
      )
    ).or(
      memberships.where(
        "additional_members.email ILIKE ?",
        "%#{query}%"
      )
    ).paginate(page: (page.to_i + 1), per_page: per_page.to_i).order(created_at: :desc)

    @total =
    memberships.where(
      "memberships.name ILIKE ?",
      "%#{query}%"
    ).or(
      memberships.where(
        "memberships.last_name ILIKE ?",
        "%#{query}%"
      )
    ).or(
      memberships.where(
        "memberships.full_name ILIKE ?",
        "%#{query}%"
      )
    ).or(
      memberships.where(
        "memberships.phone ILIKE ?",
        "%#{query}%"
      )
    ).or(
      memberships.where(
        "memberships.email ILIKE ?",
        "%#{query}%"
      )
    ).or(
      memberships.where(
        "memberships.last4 ILIKE ?",
        "%#{query}%"
      )
    ).or(
      memberships.where(
        "memberships.brand ILIKE ?",
        "%#{query}%"
      )
    ).or(
      memberships.where(
        "memberships.notes ILIKE ?",
        "%#{query}%"
      )
    ).or(
      memberships.where(
        "additional_members.name ILIKE ?",
        "%#{query}%"
      )
    ).or(
      memberships.where(
        "additional_members.phone ILIKE ?",
        "%#{query}%"
      )
    ).or(
      memberships.where(
        "additional_members.email ILIKE ?",
        "%#{query}%"
      )
    ).count
    render json: { memberships: @memberships.includes(:additional_members).map { |m| {
      id: m[:id],
      name: m[:name],
      last_name: m[:last_name],
      email: m[:email],
      phone: m[:phone],
      additional_members: m.additional_members.map { |am| am[:name] },
      quantity: m.quantity,
      notes: m.notes,
      stripe_subscription_metadata: m[:stripe_subscription_metadata],
      created_at: m[:created_at]
    }}, total: @total }
  end

  def attach_subscription
    stripe_plan_id = membership_params[:stripe_plan_id]
    stripe_tax_rate_id = membership_params[:stripe_tax_rate_id]
    stripe_coupon_id = membership_params[:stripe_coupon_id]
    quantity = membership_params[:quantity]
    payment_method_id = membership_params[:payment_method_id] unless membership_params[:payment_method_id].blank?

    to_stripe = { customer: @membership.stripe_customer_id }
    to_stripe[:items] = [{ plan: stripe_plan_id, quantity: quantity }]
    to_stripe[:default_tax_rates] = [stripe_tax_rate_id]
    to_stripe[:coupon] = stripe_coupon_id if stripe_coupon_id.present? unless membership_params[:payment_method_id].blank?
    to_stripe[:default_payment_method] = payment_method_id unless membership_params[:payment_method_id].blank?
    to_stripe[:trial_end] = (DateTime.strptime(membership_params[:trial_end], "%Y-%m-%d") + 1.day).to_i unless membership_params[:trial_end].blank?
    to_stripe[:cancel_at] = (DateTime.strptime(membership_params[:cancel_at], "%Y-%m-%d") + 1.day).to_i unless membership_params[:cancel_at].blank?

    begin
      metadata = Stripe::Subscription.create(to_stripe, { stripe_account: current_user.company.stripe_user_id })
    rescue StandardError => e
      Rails.logger.info e
    end

    @membership.stripe_subscription_metadata = metadata
    @membership.audit_comment = "Attach new subscription"
    @membership.save

    render json: @membership
  end

  def edit_subscription
    subscription_id = membership_params[:subscription_id]
    stripe_tax_rate_id = membership_params[:stripe_tax_rate_id]
    quantity = membership_params[:quantity]
    stripe_coupon_id = membership_params[:stripe_coupon_id]
    payment_method_id = membership_params[:payment_method_id] unless membership_params[:payment_method_id].blank?

    to_stripe = {}
    to_stripe[:default_tax_rates] = [stripe_tax_rate_id]
    to_stripe[:quantity] = quantity
    to_stripe[:coupon] = stripe_coupon_id if stripe_coupon_id.present? unless membership_params[:payment_method_id].blank?
    to_stripe[:default_payment_method] = payment_method_id unless membership_params[:payment_method_id].blank?
    to_stripe[:trial_end] = (DateTime.strptime(membership_params[:trial_end], "%Y-%m-%d") + 1.day).to_i unless membership_params[:trial_end].blank?
    to_stripe[:cancel_at] = (DateTime.strptime(membership_params[:cancel_at], "%Y-%m-%d") + 1.day).to_i unless membership_params[:cancel_at].blank?

    begin
      metadata = Stripe::Subscription.update(subscription_id, to_stripe, { stripe_account: current_user.company.stripe_user_id })
    rescue StandardError => e
      Rails.logger.info e
    end

    @membership.stripe_subscription_metadata = metadata
    @membership.audit_comment = "Edit subscription"
    @membership.save

    render json: @membership
  end

  def refund
    Rails.logger.info "hehre"
    Rails.logger.info membership_params
    charge_id = membership_params[:charge_id]
    refund = current_user.default_location.refunds.new({ stripe_customer_id: @membership.stripe_customer_id, amount: membership_params[:charge_amount], reason: membership_params[:refund_reason] })
    begin
          metadata = Stripe::Refund.create({
                                             charge: charge_id
                                           }, { stripe_account: current_user.company.stripe_user_id })
          refund.metadata = metadata

          refund.save

          render json: { success: true }
          rescue StandardError => e
            render json: { success: false, error: e }
        end
  end

  def checkin
    @membership.checkins.create
  end

  def add_additional_member
    Rails.logger.info membership_params
    @membership.additional_members.create([membership_params])
    @membership.audit_comment = "Added Member #{membership_params[:name]}"
    @membership.save
    render json: { success: true }
  rescue
    render json: { success: false }
  end

  def remove_additional_member
    Rails.logger.error membership_params
    am = AdditionalMember.find(membership_params[:additional_member_id])
    am.destroy
    @membership.audit_comment = "Removed Member #{am.name}"
    @membership.save
    render json: { success: true }
  rescue
    render json: { success: false }
  end


  private
    # Use callbacks to share common setup or constraints between actions.
    def set_membership
      @membership = Membership.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def membership_params
      params.fetch(:membership, {}).permit(
        :stripe_plan_id,
        :location_id,
        :name,
        :last_name,
        :phone,
        :email,
        :card_number,
        :card_exp_month,
        :card_exp_year,
        :card_cvc,
        :payment_method_id,
        :quantity,
        :notes,
        :stripe_tax_rate_id,
        :stripe_coupon_id,
        :charge_id,
        :charge_amount,
        :refund_reason,
        :signature,
        :total,
        :recurring,
        :interval,
        :additional_member_id,
        :trial_end,
        :skip_payment,
        :cancel_at,
        :subscription_id,
        additional_members: [:name, :phone, :email, :notes],
      )
    end
end
