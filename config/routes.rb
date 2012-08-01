UserManagement::Application.routes.draw do
  resources :users do
    member do
      post 'post_data'
    end

    collection do
      post 'post_data'
    end
  end

end
