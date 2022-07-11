class FoodsController < ApplicationController

    wrap_parameters format: []
    before_action :authorize, only: [:create, :update, :destroy]

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
        params.permit(:name, :address, :website, :pictures, :proximity, :upvote, :downvote, :food_type, :description, :latitude, :longitude)
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
end
