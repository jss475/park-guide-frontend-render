class CreateUlSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :lodging_id, :upvote?, :downvote?, :favorite?, :review
  has_one :user
end
