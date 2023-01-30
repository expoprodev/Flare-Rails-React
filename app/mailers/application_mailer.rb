# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: "no-reply@crowdflare.app"
  layout "mailer"
end
