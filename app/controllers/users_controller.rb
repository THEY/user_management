class UsersController < ApplicationController
  before_filter :prepare_params,only: [:post_data,:update]
  before_filter :prepare_attributes,only: [:index]
  
  # this is the action called for sorting, searching and pulling data to index
  def index
    #search method will search model based on the params
    respond_to do |format|
      format.html {}
      format.json {
        @users = User.search_get_json(@current_page, @rows_per_page,params)
        render json: @users
      }
    end
  end
  
  #All actions are coming to post_data as per default architecture of jQgrid but this can be changed
  #TODO: make jQrgid restful so this method can be removed.
  
  def post_data
    case params[:oper]
    when 'add'
      @message = {}
      @message["status"] = ''
      create
    when 'edit'
      update
    when 'del'
      destroy
    end
  end

 #This method only respond to json as per requirement.
 #in case of error, the errors are joined and shown on the UI
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

 #This method only respond to html as per requirement.
 #in case of errors re-renders same template
  def edit
    @user = User.find(params[:id],include: :roles)
    @roles = Role.all
    respond_to do |format|
      format.html
    end
  end

  #This method only respond to both html and json as per requirement.
  #For Json request: Errors are copied into sentence and shown on to the UI
  #For html request: in case of errors re-renders edit template
  def update
    @user = User.find(params[:id])
    respond_to do |format|
      if @user.update_attributes(@user_params)
        format.html { redirect_to users_url, notice: 'User was successfully updated.' }
        format.json {
          @message = 'add ok'
          render json: [true,@message]
        }
      else
        @message = "This form has following errors: <br />"
        format.html {render action: "edit"}
        format.json {
          @message << @user.errors.full_messages.join("<br />")
          render json: @message,status: :unprocessable_entity
        }
      end
    end
  end

  #This method only respond to both html and json as per requirement.
  #For Json request: only success message is given to show on UI
  #For html request: redirects to users index page (users_path)
  def destroy
    @user = User.find(params[:id])
    @user.destroy
    respond_to do |format|
      format.html { redirect_to users_url, notice: 'User was successfully deleted.' }
      format.json { render json: { status: 'success', data: @user } }
    end
  end
  
  private
#preparing current page and rows per page attributes to can be sent to pagination
  def prepare_attributes
    @current_page = params[:page] ? params[:page].to_i : 1
    @rows_per_page = params[:rows] ? params[:rows].to_i : 10
  end

#will be getting a different hash when called from html request hence created separated hash
#TODO: try adding arrays to new and edit forms so can be saved as is without preparing.
  def prepare_params
    if params[:user]
      @user_params = { id: params[:id], email: params[:user][:email],username: params[:user][:username], first_name: params[:user][:first_name],last_name: params[:user][:last_name] ,role_ids: params[:user][:role_ids]}
    else
      @user_params = { id: params[:id], email: params[:email],username: params[:username], first_name: params[:first_name],last_name: params[:last_name]}
    end
  end
end
