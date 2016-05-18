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
    message = Message.find(params[:id])

    if current_user.id == message.user.id
      if message.nil?
        render json: {errors: 'Error on delete this message.'}, status: 400
      else
        message.destroy
        render json: {}
      end
    else
      render json: {errors: 'You are not allowed to remove this message.'}, status: 403
    end
  end

  def index
    render json: AjaxHandler.process_message(Event.first, params[:last_timestamp])
  end

end
