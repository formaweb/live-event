class Admin::DashboardController < ApplicationController
  before_action :authenticate_user!
  
  def index
    @event = Event.first
    @messages = Message.order('id desc').limit(20).reverse
    @online_users = User.where(online: true)
  end
  
  def event
    event = Event.last
    if event.update_attributes({video_url: params['video_url'], name: params['event_name']})
      render json: {}
    else
      render json: {errors: event.errors.full_messages}, status: 400
    end
  end
  
end