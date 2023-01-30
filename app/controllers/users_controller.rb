# frozen_string_literal: true

class UsersController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_user, only: %i[show edit update destroy]
  load_and_authorize_resource
  skip_authorization_check only: %i[new create]

  # GET /users
  # GET /users.json
  def index
    @users = current_user.company.users
  end

  # GET /users/1
  # GET /users/1.json
  def show; end

  # GET /users/new
  def new
    @user = User.new
  end

  # GET /users/1/edit
  def edit; end

  def my_account
    @user = current_user
  end

  # POST /users
  # POST /users.json
  def create
    respond_to do |format|
      @user =
        User.invite!(
          {
            email: user_params[:email],
            name: user_params[:name],
            company: current_user.company,
            pin: user_params[:pin],
            role: user_params[:role]
          },
          current_user
        )
      if @user
        format.html do
          redirect_to users_path, notice: "User was successfully created."
        end
        format.json { render :show, status: :created, location: @user }
      else
        format.html { render :new }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
    params = user_params
    params.delete("role") if @user.id == current_user.id

    respond_to do |format|
      if @user.update(params)
        format.html do
          redirect_to users_path, notice: "User was successfully updated."
        end
        format.json { render :show, status: :ok, location: @user }
      else
        format.html { render :edit }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @user.destroy
    respond_to do |format|
      format.html do
        redirect_to users_url, notice: "User was successfully destroyed."
      end
      format.json { head :no_content }
    end
  end

  def invite
    respond_to do |format|
      @user =
        User.invite!(
          {
            email: user_params[:email],
            name: user_params[:name],
            role: user_params[:role],
            company: current_user.company,
            pin: user_params[:pin]
          },
          current_user
        )
      if @user
        format.html do
          redirect_to users_path, notice: "User was successfully created."
        end
        format.json { render :show, status: :created, location: @user }
      else
        format.html { render :new }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  def me
    @user = current_user
  end

  def switch
    pin = params[:pin]
    imposter = current_user.company.users.select { |u| u.pin == pin }.first
    imposter.update_attribute(:last_sign_in_at, Time.now)
    impersonate_user(imposter)
  end

  def lock
    stop_impersonating_user
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_params
      params.require(:user).permit(
        :email,
        :name,
        :role,
        :timezone,
        :push_notifications,
        :email_notifications,
        :pin
      )
    end
end
