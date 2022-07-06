class UserFoodSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :food_id, :upvote?, :downvote?, :favorite?, :review
  has_one :user
  has_one :food
end
