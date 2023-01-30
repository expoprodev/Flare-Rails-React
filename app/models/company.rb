# frozen_string_literal: true

class Company < ApplicationRecord
  audited

  has_many :users
  has_many :codes, through: :users
  has_many :groups
  has_many :incidents, through: :codes
  has_many :incoming_messages
  has_many :locations
  has_many :responses
  has_many :payouts
  has_many :daily_active_codes
  has_many :plans, through: :locations
  has_many :memberships, through: :locations
  has_many :reports

  serialize :stripe_customer

  attr_accessor :stripe_card_token

  FREE_TRIAL_LENGTH = 30.days

  def free_trial?
    created_at > DateTime.now - FREE_TRIAL_LENGTH * 2
  end

  def create_invoice(report, start_end, end_date, company)
    attributes = %w[date location name subtotal discount tax application_fee total status]
    @invoices = Stripe::Invoice.list({ limit: 100, created: { gte: start_end, lte: end_date }, expand: ["data.subscription"] }, { stripe_account: company.stripe_user_id })
    # @invoices = Stripe::Invoice.list({ limit: 100, created: { gte: start_date, lte: end_date }, expand: ['data.subscription'] })

    data = CSV.generate(headers: true) do |csv|
      csv << attributes

      @invoices.auto_paging_each do |invoice|
        location_display_name = ""
        begin invoice.subscription.metadata&.location_name
              location_display_name = invoice.subscription.metadata.location_name
        rescue Exception => e
          location_display_name = ""
        end

        discount = 0
        if invoice.discount && invoice.discount.coupon.amount_off
          discount = invoice.discount.coupon.amount_off.to_f / 100
        elsif invoice.discount && invoice.discount.coupon.percent_off
          discount = (invoice.subtotal.to_f / 100) * (invoice.discount.coupon.percent_off / 100)
        end
        csv << [
          DateTime.strptime(invoice.created.to_s, "%s").to_s,
          location_display_name,
          invoice.customer_name,
          (invoice.subtotal.to_f / 100),
          discount.to_f,
          invoice.tax ? (invoice.tax.to_f / 100) : 0,
          invoice.application_fee_amount ? (invoice.application_fee_amount.to_f / 100) : 0,
          (invoice.total.to_f / 100),
          invoice.status
        ]
      end
    end

    File.open("tmp.txt", "w") { |f| f.write(data) }

    report.document.attach(io: File.open("tmp.txt"), filename: "test.csv", content_type: "text/csv")
    report.update_attribute(:status, Report::COMPLETED)
    report
  end
end
