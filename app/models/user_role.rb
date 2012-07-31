class UserRole < ActiveRecord::Base
  attr_accessible :role_id, :user_id
end
