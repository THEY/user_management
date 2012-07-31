require 'spec_helper'

describe UserRole do
  context "Associations" do
	  context "associations" do
      it { should belong_to :user }
      it { should belong_to :role }
    end
  end
end
