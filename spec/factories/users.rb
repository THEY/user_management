# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :user do
    first_name 'abc'
    last_name  'xyz'
    email 'abc@xyz.com'
    username 'abcxyz'
  end
end
