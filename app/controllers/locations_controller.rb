class LocationsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_location, only: %i[show edit update destroy]

  # GET /locations
  # GET /locations.json
  def index
    @locations = current_user.company.locations
  end

  # GET /locations/1
  # GET /locations/1.json
  def show; end

  # GET /locations/new
  def new
    @location = Location.new
  end

  def first_location
    @location = Location.new
  end

  # GET /locations/1/edit
  def edit; end

  def default_location
    @location = current_user.default_location
    respond_to do |format|
      format.json { render :show, status: :ok, location: @location }
    end
  end

  def update_default_location
    @location = Location.find(params[:location_id])
    current_user.update_attribute(:default_location_id, @location.id)

    respond_to do |format|
      format.html { redirect_to memberships_url }
      format.json { render :show, status: :ok, location: @location }
    end
  end

  # POST /locations
  # POST /locations.json
  def create
    @location = current_user.company.locations.new(location_params)

    respond_to do |format|
      if @location.save
        format.html do
          redirect_to locations_path,
                      notice: "Location was successfully created."
        end
        format.json { render :show, status: :created, location: @location }
      else
        format.html { render :new }
        format.json do
          render json: @location.errors, status: :unprocessable_entity
        end
      end
    end
  end

  # PATCH/PUT /locations/1
  # PATCH/PUT /locations/1.json
  def update
    respond_to do |format|
      if @location.update(location_params)
        format.html do
          redirect_to @location, notice: "Location was successfully updated."
        end
        format.json { render :show, status: :ok, location: @location }
      else
        format.html { render :edit }
        format.json do
          render json: @location.errors, status: :unprocessable_entity
        end
      end
    end
  end

  # DELETE /locations/1
  # DELETE /locations/1.json
  def destroy
    @location.destroy
    respond_to do |format|
      format.html do
        redirect_to locations_url,
                    notice: "Location was successfully destroyed."
      end
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_location
      @location = Location.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def location_params
      params.require(:location).permit(
        :name,
        :address,
        :address_ext,
        :city,
        :state,
        :zip
      )
    end
end
