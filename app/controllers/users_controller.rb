class UsersController < ApplicationController
  before_filter :prepare_attributes,only: [:index]
  # this is the action called for sorting, searching and pulling data to index
  def index
    #search method will search model based on the params
    respond_to do |format|
      format.html {}
      format.json {
        @users = User.search_get_json(@index_columns, @current_page, @rows_per_page,params)
        render json: @users
      }
    end
  end
  
  def edit
  end

  private

  def prepare_attributes
    @index_columns = [:id, :email,:username,:first_name,:last_name]
    @current_page = params[:page] ? params[:page].to_i : 1
    @rows_per_page = params[:rows] ? params[:rows].to_i : 10
  end
  
end
