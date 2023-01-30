class Coupon < ApplicationRecord
  acts_as_paranoid
  audited

  serialize :stripe_metadata

  belongs_to :location
end
