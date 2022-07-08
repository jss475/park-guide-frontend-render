class UserLodgingsController < ApplicationController

    wrap_parameters format: []
    before_action :authorize, only:[:special_create, :upvote, :destroy, :downvote]
    def index
        render json: UserLodging.all, status: :ok
    end
    
    def show
        ul = UserLodging.find(params[:id])
        render json: ul, status: ok
    end
    
    # def create
    #     ul = UserLodging.create!(ul_params)
    #     render json: ul, status: :created, serializer: CreateUlSerializer
    # end

    # def update
    #     ul = UserLodging.find(params[:id])
    #     ul.update(ul_params)
    #     render json: ul, status: :ok
    # end

    def special_create

        if ul_w_all
            ul_instance = ul_w_all
            ul_instance.update(ul_params)
        else
            ul_instance = UserLodging.create(ul_params)
        end
        render json: ul_instance, status: :created
    end

    def upvote
        if ul_w_all
            if ul_w_all.upvote? === true
                # if it had been upvoted before, we are now saying you haven't
                new_upvote_boolean = false
                ul_w_all.update(:upvote? => new_upvote_boolean)
                #find the Lodging instance
                lodging = Lodging.find_by id: ul_params[:lodging_id]
                new_upvote = lodging["upvote"] - 1
                lodging.update(:upvote => new_upvote)
                return render json: lodging, status: :created
            else ul_w_all.upvote? === false
                new_upvote_boolean = true
                ul_w_all.update(:upvote? => new_upvote_boolean)
                lodging = Lodging.find_by id: ul_params[:lodging_id]
                new_upvote = lodging["upvote"] + 1
                lodging.update(:upvote => new_upvote)
                return render json: lodging, status: :created
            end
        else
            new_params = ul_params.merge(:upvote? => true)
            ul_instance = UserLodging.create(new_params)

            lodging = Lodging.find_by id: ul_params[:lodging_id]
            new_upvote = lodging["upvote"] + 1
            lodging.update(:upvote => new_upvote)
            return render json: lodging, status: :created
        end
    end
    
    def downvote
        if ul_w_all
            if ul_w_all.downvote? === true
                # if it had been downvoted before, we are now saying you haven't
                new_downvote_boolean = false
                ul_w_all.update(:downvote? => new_downvote_boolean)
                #find the Lodging instance
                lodging = Lodging.find_by id: ul_params[:lodging_id]
                new_downvote = lodging["downvote"] - 1
                lodging.update(:downvote => new_downvote)
                return render json: lodging, status: :created
            else ul_w_all.downvote? === false
                new_downvote_boolean = true
                ul_w_all.update(:downvote? => new_downvote_boolean)
                lodging = Lodging.find_by id: ul_params[:lodging_id]
                new_downvote = lodging["downvote"] + 1
                lodging.update(:downvote => new_downvote)
                return render json: lodging, status: :created
            end
        else
            new_params = ul_params.merge(:downvote? => true)
            ul_instance = UserLodging.create(new_params)

            lodging = Lodging.find_by id: ul_params[:lodging_id]
            new_downvote = lodging["downvote"] + 1
            lodging.update(:downvote => new_downvote)
            return render json: lodging, status: :created
        end
    end


    def destroy
        ul = UserLodging.find(params[:id])
        ul.destroy
        head :no_content
    end

    private

    def ul_params
        params.permit(:id, :user_id, :lodging_id, :upvote?, :downvote?, :favorite?, :review)
    end

    def ul_w_all
        user_id =ul_params[:user_id]
        lodging_id = ul_params[:lodging_id]
        ul_w_all = UserLodging.find_by user_id: user_id, lodging_id: lodging_id
        return ul_w_all
    end

    def current_user
        user = User.find_by(id: session[:user_id])
    end

    def authorize
        render json: { error: "You must be logged in" } unless current_user 
    end

end
