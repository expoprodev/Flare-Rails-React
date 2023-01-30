# frozen_string_literal: true

class SmsController < PublicController
  def index
    # transform request body to lowercase
    body = params["Body"].downcase
    from = params["From"].downcase
    to = params["To"].downcase

    default = "Thanks for your message!"

    Rails.logger.info params

    company = Company.find_by_program_code(to) # find by phone number
    if !company.blank?
      codes = company.codes.active.map(&:code)
      code_avail = body.split(/\s/).select { |s| codes.include?(s.to_s) }
      if !code_avail.empty?
        code = Code.find_by_code(code_avail.first)
        code.status = Code::DOWN
        code.save

        client = Twilio::REST::Client.new
        name =
          client.lookups.phone_numbers(from).fetch(type: "caller-name")
                .caller_name[
            "caller_name"
          ]
        code.incidents.create(
          reported_by_phone: from, notes: body, reported_by_name: name
        )
        body =
          if company.responses.default.blank?
            default
          else
            company.responses.default.first.message
          end

        # code.company.users.each do |user|
        #   next unless user.push_notifications

        #   user.devices.each { |device| device.notify_machine_down(code) }
        # end

        twiml =
          Twilio::TwiML::MessagingResponse.new { |r| r.message body: body }
        render xml: twiml.to_s
      else
        response =
          if company.responses.default.blank?
            default
          else
            company.responses.default.first.message
          end
        company.incoming_messages.create(from: from, message: body)

        Rails.logger.info "No Code logging as message"
        # company.users.each do |user|
        #   next unless user.push_notifications

        #   user.devices.each { |device| device.notify_message(from, body) }
        # end

        twiml =
          Twilio::TwiML::MessagingResponse.new { |r| r.message body: response }

        render xml: twiml.to_s
      end
    else
      render json: {
        status: :unprocessable_entity,
        message: "company not found",
        content_type: "application/json"
      }
    end
  end
end
