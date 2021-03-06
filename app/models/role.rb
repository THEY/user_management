class Role < ActiveRecord::Base
  attr_accessible :name

  has_many :user_roles, dependent: :destroy
  has_many :users, through: :user_roles

  validates :name,
    format: { with: User::ALPHA_NUM_REGEX },
    presence: true, uniqueness: true
end
