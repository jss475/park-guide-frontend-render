class LodgingsController < ApplicationController

    wrap_parameters format: []
    before_action :authorize, only: [:create, :update, :destroy]
    
    def index
        render json: Lodging.all, status: :ok
    end

    def show
        render json: lodging_find, status: :ok
    end

    def create
        lodging = Lodging.create!(lodging_params)
        render json: lodging, status: :created
    end

    def update
        lodging_find.update!(lodging_params_no_upvote_or_downvote)
        render json: lodging_find, status: :ok
    end

    def destroy
        lodging_find.destroy
        head :no_content
    end

    private


    def lodging_params
        params.permit(:id, :name, :address, :website, :proximity, :upvote, :downvote, :image, :lodging_amenity => [], :room_amenity =>[])
    end

    def lodging_params_no_upvote_or_downvote
        params.permit(:id, :name, :address, :website, :proximity, :image, :lodging_amenity => [], :room_amenity =>[])
    end

    def lodging_find
        Lodging.find(params[:id])
    end

    def current_user
        user = User.find_by(id: session[:user_id])
    end

    def authorize
        render json: { error: "You must be logged in" } unless current_user 
    end

end
