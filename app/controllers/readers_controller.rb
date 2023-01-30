class ReadersController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_reader, only: %i[show edit update destroy]

  # GET /readers
  # GET /readers.json
  def index
    location = current_user.default_location
    @readers = location.readers
    @stripe_readers =
      Stripe::Terminal::Reader.list({ location: location.stripe_location_id },  { stripe_account: current_user.company.stripe_user_id })
                              .map do |sr|
        {
          stripe_reader: sr,
          model: @readers.select { |r| r.stripe_reader_id == sr.id }.first
        }
      end
  end

  # GET /readers/1
  # GET /readers/1.json
  def show; end

  # GET /readers/new
  def new
    @reader = Reader.new
  end

  # GET /readers/1/edit
  def edit; end

  # POST /readers
  # POST /readers.json
  def create
    location = current_user.default_location
    label = reader_params[:label]


    stripe_reader =
      Stripe::Terminal::Reader.create(
        {
          registration_code: reader_params[:registration_code],
          label: label,
          location: location.stripe_location_id
        },  { stripe_account: current_user.company.stripe_user_id }
      )

    @reader =
      location.readers.new({ label: label, stripe_reader_id: stripe_reader.id })

    respond_to do |format|
      if @reader.save
        format.html do
          redirect_to "/readers", notice: "Reader was successfully created."
        end
        format.json { render :show, status: :created, location: @reader }
      else
        format.html { render :new }
        format.json do
          render json: @reader.errors, status: :unprocessable_entity
        end
      end
    end

  end

  # PATCH/PUT /readers/1
  # PATCH/PUT /readers/1.json
  def update
    Stripe::Terminal::Reader.update(
      @reader.stripe_reader_id,
      { label: reader_params[:label] },  { stripe_account: current_user.company.stripe_user_id }
    )

    respond_to do |format|
      if @reader.update(reader_params)
        format.html do
          redirect_to @reader, notice: "Reader was successfully updated."
        end
        format.json { render :show, status: :ok, location: @reader }
      else
        format.html { render :edit }
        format.json do
          render json: @reader.errors, status: :unprocessable_entity
        end
      end
    end
  end

  # DELETE /readers/1
  # DELETE /readers/1.json
  def destroy
    Stripe::Terminal::Reader.delete(@reader.stripe_reader_id,  {}, { stripe_account: current_user.company.stripe_user_id })
    @reader.destroy
    respond_to do |format|
      format.html do
        redirect_to readers_url, notice: "Reader was successfully destroyed."
      end
      format.json { head :no_content }
    end
  end

  def enable_readers
    location = current_user.default_location
    stripe_location =
      Stripe::Terminal::Location.create(
        {
          display_name: location.name,
          address: {
            line1: location.address,
            # line2: location.address_ext,
            city: location.city,
            country: "US",
            state: location.state,
            postal_code: location.zip
          }
        },  { stripe_account: current_user.company.stripe_user_id }
      )

    location.stripe_location_id = stripe_location.id
    location.save

    redirect_to readers_path
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_reader
      @reader = Reader.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def reader_params
      params.fetch(:reader, {}).permit(:label, :registration_code)
    end
end
