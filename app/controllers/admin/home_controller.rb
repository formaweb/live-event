class Admin::HomeController < ApplicationController
  before_action :authenticate_user!
  
  def index
    @event = Event.first
    @messages = Message.order('id desc').limit(20).reverse
  end
  
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
      puts message.errors.full_messages.inspect
      render json: {errors: message.errors.full_messages}, status: 400
    end
  end
  
end