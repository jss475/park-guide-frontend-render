class UserFoodSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :food_id, :upvote?, :downvote?, :favorite?, :review, :updated_at
  has_one :user
  has_one :food
end
