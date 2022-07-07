class FoodReviewSerializer < ActiveModel::Serializer
  attributes :id, :review, :upvote?, :downvote?, :favorite?, :user, :food
end
