require 'spec_helper'

describe User do
  context "Email validations for format" do
    it{should validate_presence_of(:email) }
	  it { should_not allow_value("blah").for(:email) }
    it { should_not allow_value("bl ah").for(:email) }
    it { should_not allow_value("a@b").for(:email) }
    it { should allow_value("a@b.com").for(:email) }
    it { should allow_value("a@b.co.m").for(:email) }
    it { should allow_value("a_b@b.co.m").for(:email) }
  end

  context "First name validations for format" do
    it { should_not allow_value("b l a h").for(:first_name) }
    it { should_not allow_value("b.l;a h").for(:first_name) }
    it { should_not allow_value("bah%$%").for(:first_name) }
    it { should allow_value("abc").for(:first_name) }
  end
  context "Last name validations for format" do
    it { should_not allow_value("b l a h").for(:last_name) }
    it { should_not allow_value("b.l;a h").for(:last_name) }
    it { should_not allow_value("bah%$%").for(:last_name) }
    it { should allow_value("abc").for(:last_name) }
  end
  context "Username validations for format" do
    it { should_not allow_value("b l a h").for(:username) }
    it { should_not allow_value("b.l;a h").for(:username) }
    it { should_not allow_value("bah%$%").for(:username) }
    it { should allow_value("abc").for(:username) }
    it { should allow_value("abc007").for(:username) }
    it { should allow_value("a_b_c_007").for(:username) }
  end

  describe "when email is already taken" do

    before do
      @user = FactoryGirl.create(:user)
      @user_with_same_email = @user.dup
      @user_with_same_email.email = @user.email.upcase
      @user_with_same_email.save
    end

    it { @user_with_same_email.should_not be_valid }
    it{ should validate_uniqueness_of(:email) }
  end

  describe "when username is already taken" do

    before do
      @user = FactoryGirl.create(:user)
      @user_with_same_email = @user.dup
      @user_with_same_email.username= @user.username.upcase
      @user_with_same_email.save
    end

    it { @user_with_same_email.should_not be_valid }
    it{ should validate_uniqueness_of(:username) }
  end

  context "Associations" do
	  it { should have_many :user_roles }
	  it { should have_many(:roles).through(:user_roles) }
  end
end

describe User, "Should be able to create conditions when filtering" do
  before(:each) do
    @columns = [:id, :username,:email, :first_name, :last_name]
    @filter_params = {"_search"=>"true", "nd"=>"1343748766898", "rows"=>"20", "page"=>"1"}
    @filter_params["filters"] = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"users.username\",\"op\":\"bw\",\"data\":\"a\"}]}"
  end

  it 'Should have valid json' do
    JSON.parse(@filter_params["filters"]).should be_instance_of(Hash)
  end

  it 'Should have valid filter params' do
    @filter_params["filters"].should_not be_nil
  end

  it 'Should have valid filter rules' do
    filters = JSON.parse(@filter_params["filters"])
    filters["rules"].should_not be_nil
  end

  it 'Should have valid filter rules params' do
    filters = JSON.parse(@filter_params["filters"])
    filters["rules"][0]["field"].should == "users.username"
    filters["rules"][0]["data"].should == "a"
  end

  it 'Should have valid filter group' do
    filters = JSON.parse(@filter_params["filters"])
    filters["groupOp"].should == 'AND'
  end

  it 'Should filter by user username ' do
    User.send("filter_by_conditions", @columns, @filter_params).should  == " users.username LIKE '%a%'"
  end

  it 'Should filter by user id' do
    @filter_params["filters"] = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"users.id\",\"op\":\"bw\",\"data\":\"1\"}]}"
    User.send("filter_by_conditions", @columns, @filter_params).should  == " users.id LIKE '%1%'"
  end


  it 'Should filter by user email' do
    @filter_params["filters"] = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"users.email\",\"op\":\"bw\",\"data\":\"abc\"}]}"
    User.send("filter_by_conditions", @columns, @filter_params).should  == " users.email LIKE '%abc%'"
  end

  it 'Should filter by user name' do
    @filter_params["filters"] = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"users.username\",\"op\":\"bw\",\"data\":\"a\"}]}"
    User.send("filter_by_conditions", @columns, @filter_params).should  == " users.username LIKE '%a%'"
  end
  
  it 'Should filter by user first_name' do
    @filter_params["filters"] = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"users.first_name\",\"op\":\"bw\",\"data\":\"a\"}]}"
    User.send("filter_by_conditions", @columns, @filter_params).should  == " users.first_name LIKE '%a%'"
  end

  it 'Should filter by user last_name' do
    @filter_params["filters"] = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"users.last_name\",\"op\":\"bw\",\"data\":\"a\"}]}"
    User.send("filter_by_conditions", @columns, @filter_params).should  == " users.last_name LIKE '%a%'"
  end

  it 'Should filter by combinations of user id, username, email, first_name and last_name' do
    @filter_params["filters"] = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"users.id\",\"op\":\"bw\",\"data\":\"1\"},{\"field\":\"users.username\",\"op\":\"bw\",\"data\":\"a\"},{\"field\":\"users.pages\",\"op\":\"bw\",\"data\":\"1\"},{\"field\":\"roles.name\",\"op\":\"bw\",\"data\":\"a\"}]}"
    User.send("filter_by_conditions", @columns, @filter_params).should  == " users.id LIKE '%1%'AND users.username LIKE '%a%'AND users.pages LIKE '%1%'AND roles.name LIKE '%a%'"
  end

end

describe User, "to_jqgrid_json" do

  before(:each) do
    @users =[]
    ['a','b'].each{ |i| @users << FactoryGirl.create(:user, email: "#{i}@#{i}domain.com",username: "#{i}_user",roles: [FactoryGirl.create(:role,name: "#{i}_role")]) }
    @columns = [:id, :username,:email, :first_name, :last_name]
    @filter_params = {"_search"=>"false", "nd"=>"1343748766898", "rows"=>"20", "page"=>"1"}
    @valid_json = JSON.parse(User.send("to_jqgrid_json", @users, @columns, 1, 20, 2))
  end

  it "should have page parameter present" do
    @valid_json["page"].should_not be_nil
  end

  it "should have page parameter equal to 1" do
    @valid_json["page"].should == "1"
  end

  it "should have records parameter present" do
    @valid_json["records"].should_not be_nil
  end


  it "should have # of records as given" do
    @valid_json["records"].should == "2"
  end
  
  it "should have 2 rows array object" do
    @valid_json["rows"].should have(2).items
  end

  it "Expected JSON returned from to_jqgrid_json" do
    @valid_json.should == {"page"=>"1", "total"=>1, "records"=>"2", "rows"=>[{"id"=>"1", "cell"=>["1", "a_user", "a@adomain.com", "abc", "xyz", "a_role", "/users/1/edit"]}, {"id"=>"2", "cell"=>["2", "b_user", "b@bdomain.com", "abc", "xyz", "b_role", "/users/2/edit"]}]}
  end

  it "rows array should have valid keys" do
    @valid_json["rows"][0].keys.should == ["id","cell"]
  end

  it "cell should have 7 enties for id, username, email, first, last name, role and link to edit" do
    @valid_json["rows"][0]["cell"].should have(7).items
  end

  it "should have rows array object" do
    @valid_json["rows"][0].should have(2).items
  end

  it "should have # of records as given" do
    @valid_json["total"].should == 1
  end

end

describe User, "to_jqgrid_json with 0 records" do
  it "should have page parameter equal to 1" do
    valid_json = JSON.parse(User.send("to_jqgrid_json", @users, @columns, 1, 20, 0))
    valid_json['records'].should == "0"
  end
end

describe User, "search_get_json" do
  before(:each) do
    #search_get_json(index_columns, current_page, rows_per_page, params)
    @users =[]
    ('a'..'z').to_a.each{ |i| @users << FactoryGirl.create(:user, email: "#{i}@#{i}domain.com",username: "#{i}_user")}
    @params = {"_search"=>"false", "rows"=>"20", "page"=>"1", "sidx"=>"id", "sord"=>"desc"}
    @columns = [:id, :username,:email, :first_name, :last_name]
  end
  
  it "Should return valid Json at page load with no search params" do
    @valid_json = JSON.parse(User.search_get_json(@columns, 1, 20, @params))
    @valid_json["page"].should == "1"
    @valid_json["total"].should == 2
    @valid_json["records"].should == "26"
    @valid_json["rows"].should have(20).items
  end
  
  it "Should return valid JSON at page 2 load with no search params" do
    @valid_json = JSON.parse(User.search_get_json(@columns, 2, 20, @params))
    @valid_json["page"].should == "2"
    @valid_json["total"].should == 2
    @valid_json["records"].should == "26"
    @valid_json["rows"].should have(6).items
  end
  
end

describe User, "search_get_json with 40 rows per page" do
  before(:each) do
    #search_get_json(index_columns, current_page, rows_per_page, params)
    @users =[]
    ('a'..'z').to_a.each{ |i| @users << FactoryGirl.create(:user, email: "#{i}@#{i}domain.com",username: "#{i}_user")}
    params = {"_search"=>"false", "rows"=>"40", "page"=>"1", "sidx"=>"id", "sord"=>"desc"}
    columns = [:id, :username,:email, :first_name, :last_name]
    @valid_json = JSON.parse(User.search_get_json(columns, 1, 40, params))
  end

  it "Should return valid Json at page load with no search params" do
    @valid_json["page"].should == "1"
    @valid_json["total"].should == 1
    @valid_json["records"].should == "26"
    @valid_json["rows"].should have(26).items
  end

end