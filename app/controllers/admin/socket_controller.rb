class Admin::SocketController < ApplicationController
  include Tubesock::Hijack
  before_action :authenticate_user!

  def index
    hijack do |tubesock|
      
      current_user.update_attributes(online: true)
      
      redis_thread = Thread.new do
        Redis.new.subscribe "event_1" do |on|
          on.message do |channel, message|
            tubesock.send_data message
          end
        end
      end

      tubesock.onmessage do |m|
        message = JSON.parse(m)
        
        case message['type']
        when 'typing'
          Redis.new.publish('event_1', {'type' => 'typing', 'user_id' => current_user.udid, 'user_name' => current_user.name, 'message' => message['message'], 'user_photo' => current_user.photo(nil)}.to_json)
        end
      end
      
      tubesock.onclose do
        current_user.update_attributes(online: false)
        redis_thread.kill
      end
    end
  end
  
end