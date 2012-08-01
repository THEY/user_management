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
      xhr :get, :index, :format => "json"
      response.should be_success
    end
  end

  describe "GET 'index' format: json" do
    it "GET ajax json call for 'index'" do
      xhr :get, :index, :format => "json"
      assigns(:users).should eq("{\"page\":\"1\",\"total\":1,\"records\":\"2\",\"rows\":[{\"id\":\"1\",\"cell\":[\"1\",\"a@adomain.com\",\"a_user\",\"abc\",\"xyz\",\"a_role\",\"/users/1/edit\"]},{\"id\":\"2\",\"cell\":[\"2\",\"b@bdomain.com\",\"b_user\",\"abc\",\"xyz\",\"b_role\",\"/users/2/edit\"]}]}")
    end
  end

end
