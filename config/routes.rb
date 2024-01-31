require 'sidekiq/web'
Rails.application.routes.draw do
  mount Sidekiq::Web => '/sidekiq'
  get 'inventory_offers/create'
  get 'inventory_offers/destroy'
  devise_for :admins
  devise_for :users, controllers: {registrations: 'users/registrations', sessions: "users/sessions", passwords: 'users/passwords' }
  resources :inventories do
    collection do
      post :search
      get :upload_csv
      post :attach_csv
      get :download_sample_csv
    end
    member do
      post :next_step
    end
  end

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  get 'switch_mode', to: 'application#switch_mode', as: 'switch_mode'
  get 'buyer_dashboard', to: 'dashboard#buyer_dashboard', as: 'buyer_dashboard'
  get 'seller_dashboard', to: 'dashboard#seller_dashboard', as: 'seller_dashboard'
  get 'list_inventory', to: 'dashboard#listing_inventory'
  post 'filter_seller_inventories', to: 'dashboard#filter_seller_inventories'
  post 'fetch_homenet_inventory', to: 'dashboard#fetch_homenet_inventory', as: 'fetch_homenet_inventory'

  # Defines the root path route ("/")
   root to: 'dashboard#index'

   namespace :admin do
    resources :dealers
    get "/approved/:id", to: "dealers#approved"
    get "/rejected/:id", to: "dealers#rejected", as: "rejected"
    get "/user_list", to: "dealers#user_list"
  end

  resources :dashboard

   devise_scope :user do
    get "/cities" => "users/registrations#fetch_cities"
    get "pincodes" => "users/registrations#fetch_pincodes"
  end


  # mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
end
