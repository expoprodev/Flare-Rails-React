# frozen_string_literal: true

class ApiController < ActionController::API
  before_action :authenticate_user!

  def dashboard
    data = {
      machines_down: Code.all.down.count, machines_total: Code.all.count
    }
    render json: data
  end

  def machines
    Rails.logger.info current_user
    Rails.logger.info "sadsdfsadasd"
    render json:
             current_user.codes.map { |c|
               {
                 id: c.id,
                 code: c.code,
                 label: c.label,
                 status: c.display_status
               }
             }
  end

  def machine
    code = Code.includes(:incidents).find(params[:id])
    incidents = code.incidents.includes(:user)

    data = {
      machine: code,
      incidents:
        incidents.sort_by(&:created_at).reverse.map do |i|
          thing = {
            id: i.id,
            reported_by_phone: i.reported_by_phone,
            created_at: i.created_at,
            fixed_by_name: i.fixed_by_name,
            fixed_at: i.fixed_at,
            notes: i.notes,
            status: i.status
          }
          thing["user"] = i.user.email if i.user
          thing
        end
    }
    render json: data
  end

  def mark_fixed
    Rails.logger.info params
    id = params[:fixed_by]
    repair = Repair.find(params[:id])
    repair.fixed_by = id
    repair.fixed_by_name = User.find(id).name
    repair.status = params[:status]
    repair.save
    repair.code.update_attribute(:status, Code::UP) if params[:status] == Repair::FIXED
  end

  def notify
    apn = Houston::Client.development
    apn.certificate = File.read("/path/to/apple_push_notification.pem")
    notification = Houston::Notification.new(device: token)
    notification.alert = "Hello, World!"

    render json: { sent: true }, status: :ok
  end
end
