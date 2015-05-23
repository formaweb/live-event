class Admin::HomeController < ApplicationController
  before_action :authenticate_user!
  
  def index
    @event = Event.first
    @messages = Message.order('id desc').limit(20).reverse
  end
  
end