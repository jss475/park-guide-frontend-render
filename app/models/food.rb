class Food < ApplicationRecord
    has_many :user_foods
    has_many :users, through: :user_foods
    geocoded_by :address
    validates :address, presence: true
    after_validation :geocode

    validates :description, presence: true, length: {minimum: 50}
    validates :website, format: URI::DEFAULT_PARSER.regexp[:ABS_URI]
    # validate :validate_pictures
    # validates :pictures, format: URI::DEFAULT_PARSER.regexp[:ABS_URI]

    private 
    
    # def validate_pictures
    #     if !pictures.is_a?(Array) || pictures.any?{ |pic| validate_format_pic(pic)}
    #         # errors.add(:pictures, :invalid)
    #     end
    # end

    # def validate_format_pic(pic)
    #     if(!(pic =~ URI::DEFAULT_PARSER.regexp[:ABS_URI])) || pic.include?("jpg") || pic.include?("jpeg")
    #         errors.add(:pictures, "Please include a jpg/jpeg image!")
    #     end
    # end
end
