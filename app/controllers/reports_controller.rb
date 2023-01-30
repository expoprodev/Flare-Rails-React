class ReportsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_report, only: %i[show edit update destroy]

  # GET /reports
  # GET /reports.json
  def index
    @reports = current_user.company.reports.sort_by(&:created_at).reverse
  end

  # GET /reports/1
  # GET /reports/1.json
  def show
    name = @report.name || @report.created_at.to_s
    respond_to do |format|
      format.html do
        send_data @report.document.download, filename: "#{name}.csv"
      end
    end
  end

  # GET /reports/new
  def new
    @report = Report.new
  end

  # GET /reports/1/edit
  def edit; end

  # POST /reports
  # POST /reports.json
  def create
    Rails.logger.info report_params
    name = report_params[:name]
    start_date = DateTime.strptime(report_params[:start_date], "%Y-%m-%d").to_i
    end_date = (DateTime.strptime(report_params[:end_date], "%Y-%m-%d") + 1.day).to_i
    report = current_user.company.reports.create({
                                                   name: name,
                                                   start_date: report_params[:start_date],
                                                   end_date: report_params[:end_date]
                                                 })
    job = current_user.company.delay.create_invoice(report, start_date, end_date, current_user.company)

    respond_to do |format|
      if job
        format.html { redirect_to reports_url, notice: "Report was successfully created." }
        format.json { render :show, status: :created, location: @report }
      else
        format.html { render :new }
        format.json { render json: @report.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /reports/1
  # PATCH/PUT /reports/1.json
  def update
    respond_to do |format|
      if @report.update(report_params)
        format.html { redirect_to @report, notice: "Report was successfully updated." }
        format.json { render :show, status: :ok, location: @report }
      else
        format.html { render :edit }
        format.json { render json: @report.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /reports/1
  # DELETE /reports/1.json
  def destroy
    @report.destroy
    respond_to do |format|
      format.html { redirect_to reports_url, notice: "Report was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_report
      @report = Report.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def report_params
      params.fetch(:report, {}).permit(:start_date, :end_date, :name)
    end
end
