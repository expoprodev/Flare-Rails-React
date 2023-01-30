# frozen_string_literal: true

class PublicController < ActionController::Base
  # protect_from_forgery with: :exception
  skip_before_action :verify_authenticity_token

  def connection_token
    render json: Stripe::Terminal::ConnectionToken.create({}, { stripe_account: current_user.company.stripe_user_id })
  end

  def webhook
    Rails.logger.info "Webhook received:"
    endpoint_secret = ENV["STRIPE_WEBHOOK_SECRET"]

    payload = request.body.read
    sig_header = request.env["HTTP_STRIPE_SIGNATURE"]
    event = nil
    Rails.logger.info "payload received:"
    Rails.logger.info payload
    begin
      event = Stripe::Webhook.construct_event(
        payload, sig_header, endpoint_secret
      )
      Rails.logger.info "Event received:"
      Rails.logger.info event
  rescue JSON::ParserError => e
    # Invalid payload
    render json: { status: 400 }
    return
  rescue Stripe::SignatureVerificationError => e
    # Invalid signature
    render json: { status: 400 }
    return
    end

    # Handle the event
    case event.type
    when "charge.succeeded"
      # update charge email

      id = event[:data][:object][:id]

      # return status 200 if email.blank?
      customer = Stripe::Customer.retrieve(event[:data][:object][:customer], { stripe_account: event.account })
      Rails.logger.info "customer"
      Rails.logger.info customer.email
      res = Stripe::Charge.update(
        id,
        { receipt_email: customer.email },
        { stripe_account: event.account }
      )

      Rails.logger.info res
    # when 'payment_intent.succeeded'
    #   payment_intent = event.data.object # contains a Stripe::PaymentIntent
    #   # Then define and call a method to handle the successful payment intent.
    #   # handle_payment_intent_succeeded(payment_intent)
    # when 'payment_method.attached'
    #   payment_method = event.data.object # contains a Stripe::PaymentMethod
    #   # Then define and call a method to handle the successful attachment of a PaymentMethod.
    #   # handle_payment_method_attached(payment_method)
    # # ... handle other event types
    else
      puts "Unhandled event type: #{event.type}"
    end

    render json: { status: 200 }
  end
end
