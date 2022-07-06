class UsersController < ApplicationController

    def show
        user = User.find(session[:user_id])
        # user = User.find(params[:id])
        render json: user, include: [user_trails: :trail, user_lodgings: :lodging, user_foods: :food], status: :ok
    end

    def create
        user = User.create!(user_params)
        session[:user_id] = user.id
        render json: user, status: :created
    end

    private

    def user_params
        params.permit(:email, :password, :password_confirmation, :password_digest, :name)
    end
end
