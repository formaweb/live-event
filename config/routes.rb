Rails.application.routes.draw do
  devise_for :users
  
  root 'stream#index'
  
  resources :socket
  
  namespace :admin do
    root 'home#index'
    
    resources :home
    resources :socket
  end
end
