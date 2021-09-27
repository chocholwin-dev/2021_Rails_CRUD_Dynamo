Rails.application.routes.draw do

    # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
    root to: 'status#index'
  
    namespace :api do
      namespace :v1 do
        get '/status/index', to: "status#index"
        post '/status/create'
        get '/status/edit/:id', to: "status#edit"
        put '/status/update/:id', to: 'status#update'
        delete '/status/:id', to: 'status#destroy'
      end
    end 
  end
  