class TrailsController < ApplicationController

    wrap_parameters format: []
    before_action :authorize, only: [:create, :update, :destroy]

    def index
        render json: Trail.all, status: :ok
    end

    def show
        render json: trail_find, status: :ok
    end

    def create
        trail = Trail.create!(trail_params)
        render json: trail, status: :created
    end

    def update
   
        trail_find.update!(trail_params)
        render json: trail_find, status: :created
    end

    def destroy
        trail_find.destroy
        head :no_content
    end


    private

    def trail_params
        params.permit(:id, :name, :location, :proximity, :mileage, :elevation_gain, :starting_elevation, :route_type, :difficulty, :estimated_time, :food, :water, :upvote, :downvote, :starting_lat, :starting_long, :permit?, :pictures => [])
    end

    def trail_find
        Trail.find(params[:id])
    end

    def current_user
        user = User.find_by(id: session[:user_id])
    end

    def authorize
        render json: { error: "You must be logged in" } unless current_user 
    end

    # , :user_trails => [:review, :user => [:id, :password_digest, :name, :elite, :email, :password_confirmation]]
end
