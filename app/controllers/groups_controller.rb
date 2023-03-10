class GroupsController < ApplicationController
  before_action :set_group, only: %i[show edit update destroy]

  # GET /groups
  # GET /groups.json
  def index
    @groups = current_user.company.groups
  end

  # GET /groups/1
  # GET /groups/1.json
  def show; end

  # GET /groups/new
  def new
    @group = Group.new
  end

  # GET /groups/1/edit
  def edit; end

  # POST /groups
  # POST /groups.json
  def create
    @group = current_user.company.groups.new(group_params)

    respond_to do |format|
      if @group.save
        format.html do
          redirect_to @group, notice: "Group was successfully created."
        end
        format.json { render :show, status: :created, location: @group }
      else
        format.html { render :new }
        format.json do
          render json: @group.errors, status: :unprocessable_entity
        end
      end
    end
  end

  # PATCH/PUT /groups/1
  # PATCH/PUT /groups/1.json
  def update
    respond_to do |format|
      if @group.update(group_params)
        format.html do
          redirect_to @group, notice: "Group was successfully updated."
        end
        format.json { render :show, status: :ok, location: @group }
      else
        format.html { render :edit }
        format.json do
          render json: @group.errors, status: :unprocessable_entity
        end
      end
    end
  end

  # DELETE /groups/1
  # DELETE /groups/1.json
  def destroy
    @group.destroy
    respond_to do |format|
      format.html do
        redirect_to groups_url, notice: "Group was successfully destroyed."
      end
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_group
      @group = Group.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def group_params
      params.require(:group).permit(:name)
    end
end
