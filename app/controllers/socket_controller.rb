class SocketController < ApplicationController
  include Tubesock::Hijack

  def index
    hijack do |tubesock|
      
      redis_thread = Thread.new do
        Redis.new.subscribe "event_1" do |on|
          on.message do |channel, message|
            tubesock.send_data message
          end
        end
      end
      
      tubesock.onclose do
        redis_thread.kill
      end
    end
  end
  
end