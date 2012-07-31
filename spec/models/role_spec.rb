require 'spec_helper'

describe Role do
  context "Validations" do
	  before(:each) do
      @role = FactoryGirl.create(:role)
    end
	  it{should validate_presence_of(:name)}
	  it{should validate_uniqueness_of(:name)}

    context "Validations for format" do
      it { should allow_value("blah").for(:name) }
      it { should_not allow_value("bl ah").for(:name) }
      it { should_not allow_value("a@b").for(:name) }
      it { should_not allow_value("a@b.com").for(:name) }
      it { should_not allow_value("a@b.co.m").for(:name) }
      it { should_not allow_value("a_b@b.co.m").for(:name) }
    end
  end

  context "Associations" do
	  it { should have_many :user_roles }
	  it { should have_many :users }
  end
end
