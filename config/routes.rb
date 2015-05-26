Rails.application.routes.draw do
  devise_for :users
  
  root 'stream#index'
  
  resources :socket
  
  namespace :admin do
    root 'dashboard#index'
    
    resources :dashboard do
      collection do
        post :event
      end
    end
    
    resources :messages
    resources :socket
  end
end
