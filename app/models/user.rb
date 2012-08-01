class User < ActiveRecord::Base
  #accessible attributes for user model
  attr_accessible :email, :first_name, :last_name, :username,:role_ids
  # users can have many roles and roles can have many users
  has_many :user_roles, dependent: :destroy
  has_many :roles, through: :user_roles

  #Creating regex constants which can be used across models.
  # This can go on the a constants.rb in initializers but good to have here
  # so can be reviewed for validations

  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-zA-Z\d\-.]+\.[a-zA-Z]+\z/
  ALPHA_ONLY_REGEX = /\A[a-zA-Z]+\z/
  ALPHA_NUM_REGEX = /\A[a-zA-Z0-9_]+\z/

  # first_name and last_name should be present always and have alpha reg-ex
  validates :first_name,
    format: { with: ALPHA_ONLY_REGEX },
    presence: true

  validates :last_name,
    format: { with: ALPHA_ONLY_REGEX },
    presence: true
# username should be present always, have alpha numeric reg-ex and should be unique
  validates :username,
    format: { with: ALPHA_NUM_REGEX },
    presence: true, uniqueness: true
# email should be present always, has standard validation reg-ex and should be unique
  validates :email,
    format: { with: VALID_EMAIL_REGEX },
    presence: true, uniqueness: true
  

# This method returns a valid json output which is required by jQgrid
  def self.search_get_json(current_page, rows_per_page, params)
    index_columns = [:id, :email,:username,:first_name,:last_name]
   #Setting the default conditions for pagination are per page and current page
    conditions = {page: current_page, per_page: rows_per_page}
    #changing value of id to users.id as search was giving an error because of joining more than 1 model.
    params["sidx"] = 'users.id' if params["sidx"].eql?("id")
    #if order is given then use that for ordering (sorting) else use default sort
    conditions[:order] = params["sidx"] + " " + params["sord"] unless (params[:sidx].blank? || params[:sord].blank?)
    #filter_by_conditions is called when search is true which returns a string of all columns which are searched.
    conditions[:conditions] = filter_by_conditions(index_columns, params) if params[:_search] == "true"
    #using paginate method from will_paginate for pagination and searching
    results = self.paginate(conditions).includes(:roles)
    #to_jqgrid_json method gives actual json which is required for showing data into grid
    self.to_jqgrid_json(results, index_columns, current_page, rows_per_page, results.total_entries)
  end
  
  private
  def self.filter_by_conditions(columns, params)
    #initializing conditions string
    conditions = ""
    #Parsing the filters params
    filters = JSON.parse(params["filters"])
    #fetching query_joiner which is AND
    query_joiner = filters["groupOp"]
    #Creating query based on columns
    query = []
    #Creating query based on columns
    unless filters["rules"].blank?
      #"rules" will have a hash to get the information about field and data
      filters["rules"].each do |rule|
        field = rule["field"]
        data =  rule["data"]
        query << " #{field} LIKE '%#{data}%'"
      end
    end
    #joining and returning the query
    conditions = query.join("#{query_joiner}")
    conditions.chomp("AND ")
  end

  def self.to_jqgrid_json(results, attributes, current_page, per_page, total)
    # setting basic page#, total entries and records so can be used by jqGrid
    json = %Q({"page":"#{current_page}","total":#{total/per_page.to_i+1},"records":"#{total}")

    if total > 0
      # setting rows start
      json << %Q(,"rows":[)
      results.each do |elem|
        elem.id ||= index(elem)
        #setting id column and now populating cells now.
        json << %Q({"id":"#{elem.id}","cell":[)
        couples = elem.attributes.symbolize_keys
        #populating attribute values
        attributes.each do |atr|
          value =  elem.send(atr)
          if value and value.is_a?(String)
            value = value.to_json
            json << %Q(#{value},)
          else
            json << %Q("#{value}",)
          end
        end
        #Adding roles joining by , and link to edit method
        json << %Q("#{elem.roles.collect(&:name).join(",")}",)
        json << %Q("/users/#{elem.id}/edit",)
        json.chop! << "]},"
      end
      json.chop! << "]"
      json << "}"
    else
      json << "}"
    end
    json
  end

  
end
