class SearchController < ApplicationController
  def index
    render json: Membership.raw_search(params[:query], filters: "company_id:#{current_user.company_id}")
  end
end
