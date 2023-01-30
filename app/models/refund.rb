class Refund < ApplicationRecord
  audited

  serialize :metadata
end
