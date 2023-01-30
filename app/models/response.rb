class Response < ApplicationRecord
  acts_as_paranoid
  audited
  belongs_to :company
  has_many :codes

  scope :default, -> { where(is_default: true) }
end
