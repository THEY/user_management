class UsersController < ApplicationController
  before_filter :prepare_params,only: [:post_data,:update]
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

  def post_data
    case params[:oper]
    when 'add'
      @message = {}
      @message["status"] = ''
      create
    when 'edit'
      @message = ''
      update
    when 'del'
      destroy
    end
  end


  def create
    if params["id"] == "_empty" || params["id"].blank?
      @user = User.new(@user_params)
      respond_to do |format|
        if @user.save
          format.json {
            @message["status"] << ('add ok')
            render json: [true,@message]
          }
        else
          format.json {
            @message["status"] << @user.errors.full_messages.join("<br />")
            render json: @message,status: :unprocessable_entity
          }

        end
      end
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

  def prepare_params
    if params[:book]
      @user_params = { id: params[:id], email: params[:user][:email],username: params[:user][:username], first_name: params[:user][:first_name],last_name: params[:user][:last_name] ,role_ids: params[:user][:role_ids]}
    else
      @user_params = { id: params[:id], email: params[:email],username: params[:username], first_name: params[:first_name],last_name: params[:last_name]}
    end
  end
  
end
