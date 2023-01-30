# frozen_string_literal: true

class IncidentsController < ApplicationController
  load_and_authorize_resource
  before_action :set_code, only: %i[new create show]

  def index
    @incidents =
      current_user.default_location.incidents.includes(:code, :default_code)
                  .where(
                    "incidents.status in(?) ",
                    [Incident::OPEN, Incident::IN_PROGRESS]
                  )

    @incidents_open = @incidents.open&.sort_by(&:created_at).reverse.map do |i|
      next unless i.code

      {
        id: i.id,
        code_id: i&.code&.id,
        code_label: i&.code&.label,
        notes: i.notes,
        display_status: i.display_status,
        tags: i&.code.tags.map(&:name),
        reported_at: i.created_at.in_time_zone(current_user.timezone).strftime("%m/%d/%Y")
      }
    end.compact
    @incidents_progress = @incidents.progress&.sort_by(&:created_at).reverse.map do |i|
      next unless i.code

      {
        id: i.id,
        code_id: i&.code&.id,
        code_label: i&.code&.label,
        notes: i.notes,
        display_status: i.display_status,
        tags: i&.code.tags.map(&:name),
        reported_at: i.created_at.in_time_zone(current_user.timezone).strftime("%m/%d/%Y")
      }
    end.compact
    @incidents_closed = @incidents.closed&.sort_by(&:created_at).reverse.map do |i|
      next unless i.code

      {
        id: i.id,
        code_id: i&.code&.id,
        code_label: i&.code&.label,
        notes: i.notes,
        display_status: i.display_status,
        tags: i&.code.tags.map(&:name),
        reported_at: i.created_at.in_time_zone(current_user.timezone).strftime("%m/%d/%Y")
      }
    end.compact
  end

  def new
    @incident = @code.incidents.new
  end

  def edit
    @incident = Incident.find(params["id"])
  end

  def show
    @incident = Incident.find(params["id"])
  end

  def create
    @incident = @code.incidents.new(incident_params)
    @incident.reported_by_user_id = current_user.id
    respond_to do |format|
      if @incident.save
        @code.status = @incident.status
        @code.save
        format.html do
          redirect_to [@code, @incident],
                      notice: "Incident was successfully created."
        end
        format.json { render :show, status: :created, location: @code }
      else
        format.html { render :new }
        format.json do
          render json: @incident.errors, status: :unprocessable_entity
        end
      end
    end
  end

  def update
    respond_to do |format|
      if @incident.update(incident_params)
        format.html do
          redirect_to code_incidents_path(@incident.code, @incident),
                      notice: "Incident updated."
        end
        format.json { render :show, status: :created, location: @code }
      else
        format.html { render :new }
        format.json do
          render json: @incident.errors, status: :unprocessable_entity
        end
      end
    end
  end

  private
    def set_code
      @code = Code.find(params[:code_id])
    end

    def incident_params
      params.require(:incident).permit(:notes, :status)
    end
end
