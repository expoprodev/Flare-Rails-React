# frozen_string_literal: true

class CodesController < ApplicationController
  load_and_authorize_resource

  def index
    @codes = current_user.default_location.codes.includes(:incidents, :tags)
    @counts = current_user.default_location.incidents.group(:code_id).count
  end

  def new
    @code = Code.new
  end

  def show
    @code = Code.find(params["id"])
  end

  def create
    @code = current_user.codes.new(code_params)
    @code.company_id = current_user.company.id

    respond_to do |format|
      if @code.save
        format.html do
          redirect_to @code, notice: "Code was successfully created."
        end
        format.json { render :show, status: :created, location: @code }
      else
        format.html { render :new }
        format.json { render json: @code.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /Codes/1
  # PATCH/PUT /Codes/1.json
  def update
    respond_to do |format|
      if @code.update(code_params)
        format.html do
          redirect_to @code, notice: "Code was successfully updated."
        end
        format.json { render :show, status: :ok, location: @code }
      else
        format.html { render :edit }
        format.json { render json: @code.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /Codes/1
  # DELETE /Codes/1.json
  def destroy
    @code.destroy
    respond_to do |format|
      format.html do
        redirect_to codes_url, notice: "Code was successfully destroyed."
      end
      format.json { head :no_content }
    end
  end

  def deactivate
    @code = Code.find(params["id"])
    @code.update_attribute(:status, Code::INACTIVE)
    redirect_to codes_url, notice: "Code was deactivated."
  end

  def reactivate
    @code = Code.find(params["id"])
    @code.update_attribute(:status, Code::UP)
    redirect_to codes_url, notice: "Code was reactivated."
  end

  private
    def code_params
      params.require(:code).permit(
        :label,
        :code,
        :tag_list,
        :location_id,
        :group_id
      )
    end
end
