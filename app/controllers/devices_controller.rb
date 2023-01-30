# frozen_string_literal: true

class DevicesController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_device, only: %i[show edit update destroy]

  # GET /devices
  # GET /devices.json
  def index
    # @devices = Device.all
    @devices = []
  end

  # GET /devices/1
  # GET /devices/1.json
  def show; end

  # GET /devices/new
  def new
    @device = Device.new
  end

  # GET /devices/1/edit
  def edit; end

  # POST /devices
  # POST /devices.json
  def create
    @device = current_user.devices.new(device_params)

    respond_to do |format|
      if @device.save
        format.html do
          redirect_to @device, notice: "Device was successfully created."
        end
        format.json { render :show, status: :created, location: @device }
      else
        format.html { render :new }
        format.json do
          render json: @device.errors, status: :unprocessable_entity
        end
      end
    end
  end

  # PATCH/PUT /devices/1
  # PATCH/PUT /devices/1.json
  def update
    respond_to do |format|
      if @device.update(device_params)
        format.html do
          redirect_to @device, notice: "Device was successfully updated."
        end
        format.json { render :show, status: :ok, location: @device }
      else
        format.html { render :edit }
        format.json do
          render json: @device.errors, status: :unprocessable_entity
        end
      end
    end
  end

  # DELETE /devices/1
  # DELETE /devices/1.json
  def destroy
    @device.destroy
    respond_to do |format|
      format.html do
        redirect_to devices_url, notice: "Device was successfully destroyed."
      end
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_device
      @device = Device.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def device_params
      params.require(:device).permit(:model, :uuid, :token, :platform)
    end
end
