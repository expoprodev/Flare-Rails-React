class TaxRate < ApplicationRecord
  acts_as_paranoid
  audited

  belongs_to :location

  serialize :stripe_metadata
end
