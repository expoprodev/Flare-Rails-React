# frozen_string_literal: true

class Code < ApplicationRecord
  acts_as_paranoid
  audited
  acts_as_taggable # Alias for acts_as_taggable_on :tags
  # acts_as_taggable_on :tags

  belongs_to :user
  belongs_to :location
  has_one :company, through: :user
  has_many :incidents
  has_many :requests, as: :requestable
  belongs_to :group, optional: true

  validates_presence_of :code
  validates_uniqueness_of :code

  scope :down, -> { where(status: DOWN) }
  scope :parts_ordered, -> { where(status: PARTS_ORDERED) }
  scope :up, -> { where(status: UP) }
  scope :inactive, -> { where(status: INACTIVE) }
  scope :active, -> { where(status: [DOWN, UP, PARTS_ORDERED]) }

  DOWN = 0
  UP = 1
  PARTS_ORDERED = 2
  INACTIVE = 3

  PRICE = 200 # in cents

  STATUSES = {
    DOWN => "Active",
    UP => "Active",
    PARTS_ORDERED => "Active",
    INACTIVE => "Inactive"
  }.freeze

  def display_status
    STATUSES[status]
  end

  def display_group_name
    group ? group.name : "Default"
  end

  def broken?
    status == DOWN
  end
end
