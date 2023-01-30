class Payout < ApplicationRecord
  acts_as_paranoid
  audited

  belongs_to :company

  serialize :metadata
  FEE = 0.10

  def self.to_be_paid(company)
    return true if company.stripe_user_id.blank?

    # Since last payment
    last_payout = company.payouts.order(created_at: :desc).take(1)&.first&.created_at.to_i || 0

    customers = company.memberships.map(&:stripe_customer_id)

    outstanding_invoices = Stripe::Charge.list({ created: { gte: last_payout }, limit: 100 }, { stripe_account: current_user.company.stripe_user_id })
    outstanding_owed = 0
    outstanding_invoices.auto_paging_each do |charge|
      next unless customers.include?(charge["customer"])
      next unless charge["status"] == "succeeded"
      next if charge["refunded"] == true
      next if charge["disputed"] == true

      outstanding_owed += charge["amount"] - charge["amount_refunded"]
    end

    return true if outstanding_owed <= 0

    outstanding_owed -= (outstanding_owed * FEE)
    outstanding_owed = outstanding_owed.round

    transfer = Stripe::Transfer.create({
                                         amount: outstanding_owed,
                                         currency: "usd",
                                         destination: company.stripe_user_id
                                       }, { stripe_account: current_user.company.stripe_user_id })

    payout = company.payouts.new(fee: FEE, amount: outstanding_owed, payment_type: "transfer", stripe_id: transfer.id, metadata: transfer)
    payout.save
  end

  def test
    customers = company.memberships.map(&:stripe_customer_id)

    from = DateTime.parse("2020-08-27 00:01:08.794703").to_i
    to = DateTime.parse("2020-08-28 00:00:49.523259").to_i

    outstanding_invoices = Stripe::Charge.list({ created: { gte: from, lte: to }, limit: 100 }, { stripe_account: current_user.company.stripe_user_id })
    outstanding_owed = 0

    customersn = []
    outstanding_invoices.auto_paging_each do |charge|
      next unless customers.include?(charge["customer"])
      next unless charge["status"] == "succeeded"
      next if charge["refunded"] == true
      next if charge["disputed"] == true

      customersn.push charge["customer"]
      outstanding_owed += charge["amount"] - charge["amount_refunded"]
    end
  end
end
