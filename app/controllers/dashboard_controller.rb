# frozen_string_literal: true

class DashboardController < ApplicationController
  def index
    # @incidents =
    #   current_user.default_location.incidents.includes(:code, :user).includes(
    #     :audits
    #   ).map(&:audits).select { |a| a.to_a.count > 0 }.flatten.map do |a|
    #     {
    #       created_at: a.created_at,
    #       message: Audit.to_message(a),
    #       notes: a.audited_changes["notes"],
    #       status: a.audited_changes["status"],
    #     }
    #   end

    # daily_invoices = Stripe::Invoice.list({ created: { gte: Time.now.beginning_of_day.to_i } })
    # weekly_invoices = Stripe::Invoice.list({ created: { gte: Time.now.beginning_of_week.to_i } })

    @payouts = Stripe::Payout.list({ limit: 100 }, { stripe_account: current_user.company.stripe_user_id })

    @total_members = current_user.default_location.memberships&.pluck("SUM(quantity)").first || 0
    @active_subscriptions = current_user.default_location.memberships&.active.pluck("SUM(quantity)").first || 0
  end

  def overview
    @payouts = current_user.company.payouts

    @total_members = current_user.company.memberships&.pluck("SUM(quantity)").first || 0
    @active_subscriptions = current_user.company.memberships&.active.pluck("SUM(quantity)").first || 0

  end

  def all
    @incidents =
      current_user.company.incidents.includes(:code, :user).order(
        "created_at DESC"
      ).limit(50)
  end
end
