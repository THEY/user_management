# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
@roles = []
('a'..'z').to_a.each{ |i| @roles << Role.create(name: "#{i}_role")}
100.times do
@user = User.create(email: Faker::Internet.email, username: Faker::Internet.user_name, first_name: Faker::Name.first_name,last_name: Faker::Name.last_name)
 user_roles = []
 2.times {user_roles << @roles.sort_by{rand}.last.id}
 @user.role_ids = user_roles
end