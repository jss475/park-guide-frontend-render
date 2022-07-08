class UserTrailsController < ApplicationController

    wrap_parameters format: []
    def index
        render json: UserTrail.all, status: :ok
    end
    
    def show
        ut = UserTrail.find(params[:id])
        render json: ut, status: :ok
    end

    # def create
    #     ut = UserTrail.create!(ut_params)
    #     render json: ut, status: :created, serializer: CreateUtSerializer
    # end

    def special_create
        user_id =ut_params[:user_id]
        trail_id = ut_params[:trail_id]
        ut_w_all = UserTrail.find_by user_id: user_id, trail_id: trail_id
    
        
        if ut_w_all
            ut_instance = ut_w_all
            ut_instance.update(ut_params)
            
        else
            ut_instance = UserTrail.create(ut_params)
        end
        render json: ut_instance, status: :created
    end

    # def update
    #     ut = UserTrail.find(params[:id])
    #     ut.update!(ut_params)
    #     render json: ut, status: :ok
    # end

    def destroy
        ut = UserTrail.find(params[:id])
        ut.destroy
        head :no_content
    end



    private

    def ut_params
        params.permit(:id, :user_id, :trail_id, :upvote?, :downvote?, :favorite?, :review)
    end

end
