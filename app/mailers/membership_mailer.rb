class MembershipMailer < ApplicationMailer
  default from: "no-reply@cidercade.com"

  def welcome_email
    @membership = params[:membership]
    @confirm_details = params[:confirm_details]
    @confirm_details[:signature] = @membership.signature
    mail(to: @membership.email, subject: "Subscription Confirmation for #{@membership.location.name}")
  end

  def cancel_subscription
    @membership = params[:membership]
    mail(to: @membership.email, subject: "Subscription Cancelled for #{@membership.location.name}")
  end
end
