Rails.application.routes.draw do
  
  resources :users
  resources :user_trails, only: [:update, :show, :index, :destroy]
  resources :user_foods, only: [:update, :show, :index, :destroy]
  resources :user_lodgings, only: [:update, :show, :index, :destroy]
  resources :trails
  resources :foods
  resources :lodgings
  resources :users, only: [:create, :show]

  post "/signup", to: "users#create"
  post "/login", to: "sessions#login"
  delete '/logout', to: "sessions#logout"
  patch "/trails/:id", to: "trails#update"
  post "/user_trails", to: "user_trails#special_create"
  post "/user_foods", to: "user_foods#special_create"
  post "/user_foods/upvote", to: "user_foods#upvote"
  post "/user_foods/downvote", to: "user_foods#downvote"
  post "/user_lodgings", to: "user_lodgings#special_create"
  post "/user_lodgings/upvote", to: "user_lodgings#upvote"
  post "/user_lodgings/downvote", to: "user_lodgings#downvote"

  # Routing logic: fallback requests for React Router.
  # Leave this here to help deploy your app later!
  # get "*path", to: "fallback#index", constraints: ->(req) { !req.xhr? && req.format.html? }
end
