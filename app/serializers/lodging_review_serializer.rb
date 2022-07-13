class LodgingReviewSerializer < ActiveModel::Serializer
  attributes :id, :review, :upvote?, :downvote?, :favorite?, :user, :lodging, :updated_at
end
