class Reader < ApplicationRecord
  belongs_to :location

  attr_accessor :registration_code
end
