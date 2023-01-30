class Membership < ApplicationRecord
  include AlgoliaSearch
  algoliasearch do
    attribute :name, :last_name, :phone, :email, :notes, :last4, :brand, :full_name, :company_id, :additional_members
    attributesForFaceting [:company_id]
  end

  acts_as_paranoid
  audited

  attr_accessor :card_number, :card_exp_month, :card_exp_year, :card_cvc, :payment_method_id, :trial_end

  serialize :stripe_subscription_metadata

  belongs_to :location
  has_many :checkins
  has_many :additional_members

  INACTIVE = 0
  ACTIVE = 1

  STATUSES = {
    INACTIVE => "Inactive",
    ACTIVE => "Active"
  }.freeze

  scope :active, -> { where(status: ACTIVE) }

  def company_id
    location.company_id
  end
end
