class Admin::MessagesController < ApplicationController
  before_action :authenticate_user!
  
  def create
    message = Message.new({
      event_id: 1,
      user_id: current_user.id,
      message: params['message'],
      image: params['image']
    })
    
    if message.save
      render json: {}
    else
      render json: {errors: message.errors.full_messages}, status: 400
    end
  end
  
  def destroy
    
  end
  
end