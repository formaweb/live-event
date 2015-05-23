class StreamController < ApplicationController

  def index
    @event = Event.last
    @messages = @event.messages.order('id asc')
  end

end
