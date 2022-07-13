class FoodsController < ApplicationController

    wrap_parameters format: []
    before_action :authorize, only: [:create, :update, :destroy]
    before_action :validate_pictures, only: [:create]

    def index
        render json: Food.all, status: :ok
    end

    def show
        render json: find_food, status: :ok
    end

    def create
        food = Food.create!(food_params)
        render json: food, status: :created
    end

    def update
        find_food.update!(food_params)
        render json: find_food, status: :ok
    end

    def destroy
        find_food.destroy
        head :no_content
    end



    private

    def food_params
        params.permit(:id, :name, :address, :website, :proximity, :upvote, :downvote, :food_type, :description, :latitude, :longitude, :pictures => [])
    end

    def find_food
        Food.find(params[:id])
    end

    def current_user
        user = User.find_by(id: session[:user_id])
    end

    def authorize
        render json: { error: "You must be logged in" } unless current_user 
    end

    def validate_pictures
        if !:pictures.is_a?(Array) || :pictures.any?{ |pic| validate_format_pic(pic)}
            # errors.add(:pictures, :invalid)
        end
    end

    def validate_format_pic(pic)
        if(!(pic =~ URI::DEFAULT_PARSER.regexp[:ABS_URI])) || pic.include?("jpg") || pic.include?("jpeg")
            errors.add(:pictures, "Please include a jpg/jpeg image!")
        end
    end

end
