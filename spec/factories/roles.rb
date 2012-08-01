# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :role do
    sequence(:name)  { |n| "role#{n}" }
  end
end
