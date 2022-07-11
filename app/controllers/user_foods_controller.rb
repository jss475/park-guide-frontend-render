class UserFoodsController < ApplicationController

    before_action :authorize, only:[:special_create, :upvote, :destroy, :downvote]
    
    def index
        render json: UserFood.all, status: :ok
    end
    
    def show
        uf = UserFood.find(params[:id])
        render json: uf, status: :ok
    end

    # def create
    #     uf = UserFood.create!(uf_params)
    #     render json: uf, status: :created
    # end

    # def update
    #     uf = UserFood.find(params[:id])
    #     uf.update(uf_params)
    #     render json: uf, status: :ok
    # end
    def special_create
        user_id =uf_params[:user_id]
        food_id = uf_params[:food_id]
        uf_w_all = UserFood.find_by user_id: user_id, food_id: food_id
   
        
        if uf_w_all
            uf_instance = uf_w_all
            uf_instance.update(uf_params)
            
        else
            uf_instance = UserFood.create(uf_params)
        end
        render json: uf_instance, status: :created
    end

    def upvote
        if uf_w_all
            if uf_w_all.upvote? === true
                # if it had been upvoted before, we are now saying you haven't
                new_upvote_boolean = false
                uf_w_all.update(:upvote? => new_upvote_boolean)
                #find the food instance
                food = Food.find_by id: uf_params[:food_id]
                new_upvote = food["upvote"] - 1
                food.update(:upvote => new_upvote)
                return render json: food, status: :created
            else uf_w_all.upvote? === false
                new_upvote_boolean = true
                uf_w_all.update(:upvote? => new_upvote_boolean)
                food = Food.find_by id: uf_params[:food_id]
                new_upvote = food["upvote"] + 1
                food.update(:upvote => new_upvote)
                return render json: food, status: :created
            end
        else
            new_params = uf_params.merge(:upvote? => true)
            ul_instance = UserFood.create(new_params)
            food = Food.find_by id: uf_params[:food_id]
            new_upvote = food["upvote"] + 1
            food.update(:upvote => new_upvote)
            return render json: food, status: :created
        end
    end
    
    def downvote
        if uf_w_all
            if uf_w_all.downvote? === true
                # if it had been downvoted before, we are now saying you haven't
                new_downvote_boolean = false
                uf_w_all.update(:downvote? => new_downvote_boolean)
                #find the food instance
                food = Food.find_by id: uf_params[:food_id]
                new_downvote = food["downvote"] - 1
                food.update(:downvote => new_downvote)
                return render json: food, status: :created
            else uf_w_all.downvote? === false
                new_downvote_boolean = true
                uf_w_all.update(:downvote? => new_downvote_boolean)
                food = Food.find_by id: uf_params[:food_id]
                new_downvote = food["downvote"] + 1
                food.update(:downvote => new_downvote)
                return render json: food, status: :created
            end
        else
            new_params = uf_params.merge(:downvote? => true)
            ul_instance = UserFood.create(new_params)

            food = food.find_by id: uf_params[:food_id]
            new_downvote = food["downvote"] + 1
            food.update(:downvote => new_downvote)
            return render json: food, status: :created
        end
    end

    def destroy
        uf = UserFood.find(params[:id])
        uf.destroy
        head :no_content
    end

    private

    def uf_params
        params.permit(:user_id, :food_id, :upvote?, :downvote?, :favorite?, :review)
    end

    def uf_w_all
        user_id =uf_params[:user_id]
        food_id = uf_params[:food_id]
        uf_w_all = UserFood.find_by user_id: user_id, food_id: food_id
        return uf_w_all
    end

    def current_user
        user = User.find_by(id: session[:user_id])
    end

    def authorize
        render json: { error: "You must be logged in" } unless current_user 
    end
end
