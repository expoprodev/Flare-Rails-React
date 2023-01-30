# frozen_string_literal: true

class DailyActiveCode < ApplicationRecord
  belongs_to :company

  def self.record
    Company.all.each do |company|
      DailyActiveCode.create(
        daily_active: company.codes.active.count, company_id: company.id
      )
    end
  end
end
