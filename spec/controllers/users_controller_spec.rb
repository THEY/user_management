require 'spec_helper'

describe UsersController do

  before(:each) do
    @users =[]
    ['a','b'].each{ |i| @users << FactoryGirl.create(:user, email: "#{i}@#{i}domain.com",username: "#{i}_user",roles: [FactoryGirl.create(:role,name: "#{i}_role")]) }
  end
  
  describe "GET 'index' format: json" do
    it "returns http success" do
      get 'index'
      response.should be_success
    end
  end

  describe "GET 'index' format: json" do
    it "GET ajax json call for 'index'" do
      xhr :get, :index, format: "json"
      response.should be_success
    end
  end

  describe "GET 'index' format: json" do
    it "GET ajax json call for 'index'" do
      xhr :get, :index, format: "json"
      assigns(:users).should eq("{\"page\":\"1\",\"total\":1,\"records\":\"2\",\"rows\":[{\"id\":\"1\",\"cell\":[\"1\",\"a@adomain.com\",\"a_user\",\"abc\",\"xyz\",\"a_role\",\"/users/1/edit\"]},{\"id\":\"2\",\"cell\":[\"2\",\"b@bdomain.com\",\"b_user\",\"abc\",\"xyz\",\"b_role\",\"/users/2/edit\"]}]}")
    end
  end

  describe "POST create" do

    it 'should return success' do
      lambda {
        xhr :post, :post_data, format: "json", email: Faker::Internet.email, username: "abcxyz", first_name: Faker::Name.first_name,last_name: Faker::Name.last_name, oper: :add
      }.should change(User, :count).by(1)
    end

    it "assigns a newly created user as @user" do
      xhr :post, :post_data, format: "json",email: Faker::Internet.email, username: "abcxyz", first_name: Faker::Name.first_name,last_name: Faker::Name.last_name, oper: :add
      assigns(:user).should be_a(User)
      assigns(:user).should be_persisted
    end

  end

  describe "with in-valid params" do
    it "should not create record with invalid username" do
      xhr :post, :post_data, format: "json", :username => ' ',:oper => :add
      response.should_not be_success
    end
    
    it "should have record with invalid email" do
      xhr :post, :post_data, format: "json", :email => '',:oper => :add
      response.should_not be_success
    end

    it "should have record with invalid first_name" do
      xhr :post, :post_data, format: "json", :first_name => '',:oper => :add
      response.should_not be_success
    end
    
    it "should have record with invalid last_name" do
      xhr :post, :post_data, format: "json", :last_name => '',:oper => :add
      response.should_not be_success
    end

  end

  describe "update and delete to be called on post_data" do
    before(:each) do
      @user = FactoryGirl.create(:user)
    end
    it "expect record to be updated successfully" do
      xhr :post, :post_data, format: "json", email: Faker::Internet.email, username: "abcxyz", first_name: Faker::Name.first_name,last_name: Faker::Name.last_name, oper: :edit, id: @user.id
      response.should be_success
    end

    it "expect record not to be updated successfully if data is wrong" do
      xhr :post, :post_data, format: "json", email: Faker::Internet.email, username: "", first_name: Faker::Name.first_name,last_name: Faker::Name.last_name, oper: :edit, id: @user.id
      response.should_not be_success
    end

    it "expect record to be deleted" do
      xhr :post, :post_data, format: "json",:oper => :del,:id => @user.id
      response.should be_success
    end

  end

  
end
