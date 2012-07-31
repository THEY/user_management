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

 # it 'Should filter by combinations of user id, username, email, first_name and last_name' do
 #   @filter_params["filters"] = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"users.id\",\"op\":\"bw\",\"data\":\"1\"},{\"field\":\"users.username\",\"op\":\"bw\",\"data\":\"a\"},{\"field\":\"users.pages\",\"op\":\"bw\",\"data\":\"1\"},{\"field\":\"authors.name\",\"op\":\"bw\",\"data\":\"a\"}]}"
 #   User.send("filter_by_conditions", @columns, @filter_params).should  == " users.id LIKE '%1%'AND users.username LIKE '%a%'AND users.pages LIKE '%1%'AND authors.name LIKE '%a%'"
 # end

end
