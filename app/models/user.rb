class User < ActiveRecord::Base
  attr_accessible :email, :first_name, :last_name, :username

  has_many :user_roles, dependent: :destroy
  has_many :roles, through: :user_roles

  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-zA-Z\d\-.]+\.[a-zA-Z]+\z/
  ALPHA_ONLY_REGEX = /\A[a-zA-Z]+\z/
  ALPHA_NUM_REGEX = /\A[a-zA-Z0-9_]+\z/
  
  validates :first_name,
    format: { with: ALPHA_ONLY_REGEX },
    presence: true

  validates :last_name,
    format: { with: ALPHA_ONLY_REGEX },
    presence: true

  validates :username,
    format: { with: ALPHA_NUM_REGEX },
    presence: true, uniqueness: true

  validates :email,
    format: { with: VALID_EMAIL_REGEX },
    presence: true, uniqueness: true
  


  def self.search_get_json(index_columns, current_page, rows_per_page, params)
    conditions = {page: current_page, per_page: rows_per_page}
    params["sidx"] = 'users.id' if params["sidx"].eql?("id")
    conditions[:order] = params["sidx"] + " " + params["sord"] unless (params[:sidx].blank? || params[:sord].blank?)
    conditions[:conditions] = filter_by_conditions(index_columns, params) if params[:_search] == "true"
    results = self.paginate(conditions).includes(:roles)
    self.to_jqgrid_json(results, index_columns, current_page, rows_per_page, results.total_entries)
  end
  
  private
  def self.filter_by_conditions(columns, params)
    conditions = ""
    filters = JSON.parse(params["filters"])
    query_joiner = filters["groupOp"]
    query = []
    unless filters["rules"].blank?
      filters["rules"].each do |rule|
        field = rule["field"]
        data =  rule["data"]
        query << " #{field} LIKE '%#{data}%'"
      end
    end
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
            value = escape_json(value)
            json << %Q(#{value},)
          else
            json << %Q("#{value}",)
          end
        end
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

  def self.escape_json(json)
    if json
      json.to_json
    else
      ''
    end
  end
  
end
