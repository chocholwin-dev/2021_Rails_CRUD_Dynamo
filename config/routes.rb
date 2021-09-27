Rails.application.routes.draw do

  namespace :api do
    namespace :v1 do
      get 'writing_policy_template/index', to: "writing_policy_template#index"
      post 'writing_policy_template/create'
      put 'writing_policy_template/update/:templateSK', to: "writing_policy_template#update"
      delete 'writing_policy_template/:templatePK/:templateSK', to: 'writing_policy_template#destroy'
    end
  end

  get 'writing_policy_template/index'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: 'status#index'

  namespace :api do
    namespace :v1 do
      get 'status/index', to: "status#index"
      post 'status/create'
      put 'status/update/:kosshiSK', to: "status#update"
      delete 'status/:kosshiPK/:kosshiSK', to: 'status#destroy'   
    end
  end 
end