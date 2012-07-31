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
