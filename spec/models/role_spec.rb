require 'spec_helper'

describe Role do
  context "Validations" do
	  before(:each){Role.create!(name:'manager')}
	  it{should validate_presence_of(:name)}
	  it{should validate_uniqueness_of(:name)}
  end

  context "Associations" do
	  it { should have_many :user_roles }
	  it { should have_many :users }
  end
end
