# frozen_string_literal: true

class Incident < ApplicationRecord
  audited
  belongs_to :code, optional: true
  belongs_to :default_code, optional: true
  belongs_to :user,
             class_name: "User",
             foreign_key: "reported_by_user_id",
             optional: true

  scope :open, -> { where(status: OPEN) }
  scope :closed, -> { where(status: CLOSED) }
  scope :progress, -> { where(status: IN_PROGRESS) }

  OPEN = 0
  CLOSED = 1
  IN_PROGRESS = 2

  STATUSES = {
    OPEN => "Open", IN_PROGRESS => "In Progress", CLOSED => "Completed"
  }.freeze

  def display_status
    STATUSES[status]
  end
end
