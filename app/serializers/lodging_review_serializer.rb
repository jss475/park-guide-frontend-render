class LodgingReviewSerializer < ActiveModel::Serializer
  attributes :id, :review, :upvote?, :downvote?, :favorite?, :user, :lodging
end
