class MessagesController < ApplicationController

  def index
    render json: AjaxHandler.process_message(Event.first, params[:last_timestamp])
  end

end
