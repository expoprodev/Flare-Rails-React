# frozen_string_literal: true

class Location < ApplicationRecord
  acts_as_paranoid
  audited

  belongs_to :company
  has_many :codes
  has_many :incidents
  has_many :memberships
  has_many :readers
  has_many :plans
  has_many :tax_rates
  has_many :coupons
  has_many :refunds

  validates_presence_of :name
  validates_presence_of :address
  validates_presence_of :city
  validates_presence_of :state
  validates_presence_of :zip

  serialize :metadata

  def as_indexed_json(*_)
    as_json(
      only: %i[
        company_id
        name
        address
        address_ext
        city
        state
        zip
        status
        deleted_at
        uuid
        place_id
      ]
    ).merge(location: { lat: lat, lon: lng })
  end

  def self.search_nearby_locations(lat, lng)
    search(
      {
        query: {
          bool: {
            must: { match_all: {} },
            filter: {
              geo_distance: {
                distance: "30km", location: { lat: lat, lon: lng }
              }
            }
          }
        }
      }
    )
  end
end
