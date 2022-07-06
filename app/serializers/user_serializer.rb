class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :password_confirmation, :password_digest, :name, :elite, :created_at
  has_many :user_foods
  has_many :user_trails
  has_many :user_lodgings 
  # has_many :trails, through: :user_trails
  # has_many :foods, through: :user_foods
  # has_many :lodgings, through: :user_lodgings
end
