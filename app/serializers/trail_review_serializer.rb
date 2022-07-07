class TrailReviewSerializer < ActiveModel::Serializer
  attributes :id, :review, :upvote?, :downvote?, :favorite?, :user, :trail
end
