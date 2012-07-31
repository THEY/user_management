class User < ActiveRecord::Base
  attr_accessible :email, :first_name, :last_name, :username

  has_many :user_roles, dependent: :destroy
  has_many :roles, through: :user_roles

  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-zA-Z\d\-.]+\.[a-zA-Z]+\z/
  ALPHA_ONLY_REGEX = /\A[a-zA-Z]+\z/
  ALPHA_NUM_REGEX = /\A[a-zA-Z0-9_]+\z/
  
  validates :first_name,
    format: { with: ALPHA_ONLY_REGEX },
    presence: true

  validates :last_name,
    format: { with: ALPHA_ONLY_REGEX },
    presence: true

  validates :username,
    format: { with: ALPHA_NUM_REGEX },
    presence: true, uniqueness: true

  validates :email,
    format: { with: VALID_EMAIL_REGEX },
    presence: true, uniqueness: true
  

end
