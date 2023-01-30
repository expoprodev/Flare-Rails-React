class AdditionalMember < ApplicationRecord
  acts_as_paranoid
  audited
  belongs_to :membership
end
