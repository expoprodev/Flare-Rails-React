class ResponsesController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_response, only: %i[show edit update destroy]

  # GET /responses
  # GET /responses.json
  def index
    @responses = current_user.company.responses
  end

  # GET /responses/1
  # GET /responses/1.json
  def show; end

  # GET /responses/new
  def new
    @response = Response.new
  end

  # GET /responses/1/edit
  def edit; end

  # POST /responses
  # POST /responses.json
  def create
    @response = current_user.company.responses.new(response_params)

    respond_to do |format|
      if @response.save
        format.html do
          redirect_to responses_path,
                      notice: "Response was successfully created."
        end
        format.json { render :show, status: :created, location: @response }
      else
        format.html { render :new }
        format.json do
          render json: @response.errors, status: :unprocessable_entity
        end
      end
    end
  end

  # PATCH/PUT /responses/1
  # PATCH/PUT /responses/1.json
  def update
    respond_to do |format|
      if @response.update(response_params)
        format.html do
          redirect_to responses_path,
                      notice: "Response was successfully updated."
        end
        format.json { render :show, status: :ok, location: @response }
      else
        format.html { render :edit }
        format.json do
          render json: @response.errors, status: :unprocessable_entity
        end
      end
    end
  end

  # DELETE /responses/1
  # DELETE /responses/1.json
  def destroy
    @response.destroy
    respond_to do |format|
      format.html do
        redirect_to responses_url,
                    notice: "Response was successfully destroyed."
      end
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_response
      @response = Response.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def response_params
      params.require(:response).permit(:message, :is_default)
    end
end
