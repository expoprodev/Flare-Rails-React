# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # can :manage, :all # guest user
    case user.role
    when "cashier"
      cannot :read, :activity
      cannot :read, :analytic
      can :read, User, id: user.company.users.map(&:id)
      can :update, User, id: user.id
      can :read, Membership, location_id: user.company.locations.map(&:id)
      can :read, Plan, company_id: user.company.id
      can :read, Reader, location_id: user.default_location.id
      can :switch, User
      can :lock, User
      cannot :manage, :messages
      cannot :manage, :coupons
    when "viewer"
      can :create, Incident, code_id: user.company.codes.map(&:id)
      can :read, :analytics
      can :index, Code
      can :index, User, company_id: user.company.id
      can :read, Code, company_id: user.company.id
      can :read, Incident, code_id: user.company.codes.map(&:id)
      can :read, User, id: user.company.users.map(&:id)
      can :update, User, id: user.id
      can :read, Membership, location_id: user.company.locations.map(&:id)
      can :read, Plan, company_id: user.company.id
      can :read, Reader, location_id: user.default_location.id
      can :read, Coupon, location_id: user.default_location.id
    when "editor"
      cannot :manage, :activity
      cannot :manage, :analytic
      cannot :index, Code
      cannot :manage, Code, company_id: user.company.id
      cannot :create, Incident
      cannot :manage, Incident, code_id: user.company.codes.map(&:id)
      can :manage, User, company_id: user.company.id
      can :manage, :responses
      can :manage, :locations
      cannot :manage, :customers
      cannot :manage, :messages
      can :manage, Membership, location_id: user.company.locations.map(&:id)
      can :manage, Plan, company_id: user.company.id
      can :manage, Reader, location_id: user.default_location.id
      can :manage, TaxRate, location_id: user.default_location.id
      can :manage, Coupon, location_id: user.default_location.id
    when "admin"
      can :read, :activity
      can :manage, :analytic
      can :index, Code
      can :manage, :billing
      can :manage, :setting
      can :manage, Code, company_id: user.company.id
      can :manage, Company, id: user.company.id
      can :create, Incident
      can :manage, Incident, code_id: user.company.codes.map(&:id)
      can :manage, User, company_id: user.company.id
      can :manage, :messages
      can :manage, Response, company_id: user.company.id
      can :manage, Location, company_id: user.company.id
      can :manage, :customers
      can :manage, Membership, location_id: user.company.locations.map(&:id)
      can :manage, Plan, company_id: user.company.id
      can :manage, Reader, location_id: user.default_location.id
      can :manage, TaxRate, location_id: user.default_location.id
      can :manage, Coupon, location_id: user.default_location.id
      can :manage, Report, company_id: user.company.id
    end
  end
end
