# Read about factories at https://github.com/thoughtbot/factory_girl
FactoryGirl.define do
  factory :user do
    first_name 'abc'
    last_name  'xyz'
    sequence(:username)  { |n| "person#{n}" }
    sequence(:email) { |n| "person_#{n}@example.com" }
    roles { |user|
      [
        FactoryGirl.create(:role)
      ]
    }
  end
end