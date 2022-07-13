class UserLodgingSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :lodging_id, :upvote?, :downvote?, :favorite?, :review, :updated_at
  has_one :user
  has_one :lodging
end
