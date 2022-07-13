class UserTrailSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :trail_id, :upvote?, :downvote?, :favorite?, :review, :updated_at
  belongs_to :user
  belongs_to :trail
end
