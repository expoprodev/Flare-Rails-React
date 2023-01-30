class Report < ApplicationRecord
  has_one_attached :document

  belongs_to :company

  PROCESS = 0
  COMPLETED = 1

  STATUSES = {
    PROCESS => "In Progress",
    COMPLETED => "Completed"
  }.freeze

  def display_status
    STATUSES[status]
  end
end
