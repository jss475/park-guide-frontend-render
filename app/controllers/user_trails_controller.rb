class UserTrailsController < ApplicationController

    wrap_parameters format: []
    before_action :authorize, only:[:special_create, :upvote, :destroy, :downvote]

    def index
        render json: UserTrail.all, status: :ok
    end
    
    def show
        ut = UserTrail.find(params[:id])
        render json: ut, status: :ok
    end

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

    def upvote
        if ut_w_all
            if ut_w_all.upvote? === true
                # if it had been upvoted before, we are now saying you haven't
                new_upvote_boolean = false
                ut_w_all.update(:upvote? => new_upvote_boolean)
                #find the trail instance
                trail = Trail.find_by id: ut_params[:trail_id]
                new_upvote = trail["upvote"] - 1
                trail.update(:upvote => new_upvote)
                return render json: trail, status: :created
            else ut_w_all.upvote? === false
                new_upvote_boolean = true
                ut_w_all.update(:upvote? => new_upvote_boolean)
                trail = Trail.find_by id: ut_params[:trail_id]
                new_upvote = trail["upvote"] + 1
                trail.update(:upvote => new_upvote)
                return render json: trail, status: :created
            end
        else
            new_params = ut_params.merge(:upvote? => true)
            ut_instance = UserTrail.create(new_params)

            trail = Trail.find_by id: ut_params[:trail_id]
            new_upvote = trail["upvote"] + 1
            trail.update(:upvote => new_upvote)
            return render json: trail, status: :created
        end
    end
    
    def downvote
        if ut_w_all
            if ut_w_all.downvote? === true
                # if it had been downvoted before, we are now saying you haven't
                new_downvote_boolean = false
                ut_w_all.update(:downvote? => new_downvote_boolean)
                #find the trail instance
                trail = Trail.find_by id: ut_params[:trail_id]
                new_downvote = trail["downvote"] - 1
                trail.update(:downvote => new_downvote)
                return render json: trail, status: :created
            else ut_w_all.downvote? === false
                new_downvote_boolean = true
                ut_w_all.update(:downvote? => new_downvote_boolean)
                trail = Trail.find_by id: ut_params[:trail_id]
                new_downvote = trail["downvote"] + 1
                trail.update(:downvote => new_downvote)
                return render json: trail, status: :created
            end
        else
            new_params = ut_params.merge(:downvote? => true)
            ut_instance = UserTrail.create(new_params)

            trail = Trail.find_by id: ut_params[:trail_id]
            new_downvote = trail["downvote"] + 1
            trail.update(:downvote => new_downvote)
            return render json: trail, status: :created
        end
    end


    def destroy
        ut = UserTrail.find(params[:id])
        ut.destroy
        head :no_content
    end



    private

    def ut_params
        params.permit(:id, :user_id, :trail_id, :upvote?, :downvote?, :favorite?, :review)
    end

    def ut_w_all
        user_id =ut_params[:user_id]
        trail_id = ut_params[:trail_id]
        ut_w_all = UserTrail.find_by user_id: user_id, trail_id: trail_id
        return ut_w_all
    end

    def current_user
        user = User.find_by(id: session[:user_id])
    end

    def authorize
        render json: { error: "You must be logged in" } unless current_user 
    end

end
