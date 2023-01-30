# frozen_string_literal: true

class User < ApplicationRecord
  acts_as_paranoid
  audited
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :invitable,
         :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :trackable,
         :validatable,
         :confirmable,
         :jwt_authenticatable,
         jwt_revocation_strategy: Devise::JWT::RevocationStrategies::Null

  has_many :codes
  belongs_to :company
  has_many :devices

  validates :company_name, presence: true, on: :create
  attr_accessor :company_name, :industry, :address, :address_ext, :city, :state, :zip

  validates :industry, presence: true, on: :create

  validates :address, presence: true, on: :create

  validates :address_ext, presence: true, on: :create

  validates :city, presence: true, on: :create

  validates :state, presence: true, on: :create

  validates :zip, presence: true, on: :create

  ROLES = %i[admin editor viewer cashier].freeze

  def display_name
    name || email || ""
  end

  def default_location
    if default_location_id.blank?
      company.locations.first
    else
      company.locations.find(default_location_id)
    end
  end
end
