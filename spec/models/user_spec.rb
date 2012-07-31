require 'spec_helper'

describe User do
  context "Validations" do
	  before(:each){User.create!(first_name:'abc',last_name: 'xyz',email: 'abc@xyz.com',username: 'abcxyz')}
	  it{should validate_presence_of(:email)}
	  it{should validate_presence_of(:username)}
	  it{should validate_format_of(:email)}
	  it{should validate_format_of(:username)}
  end

  context "Associations" do
	  it { should have_many :user_roles }
	  it { should have_many :roles }
  end
end
