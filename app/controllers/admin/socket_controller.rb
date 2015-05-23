class Admin::SocketController < ApplicationController
  include Tubesock::Hijack
  before_action :authenticate_user!

  def index
    hijack do |tubesock|
      
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
        when 'message'
          message = current_user.messages.new(event_id: 1, message: message['message'])
          if message.save
            Redis.new.publish('event_1', {'type' => 'message', 'id' => message.id, 'user_name' => current_user.name, 'user_id' => current_user.udid, 'message' => message.message, 'created_at' => message.created_at.to_i, 'user_photo' => current_user.photo(nil)}.to_json)
          else
            Redis.new.publish('event_1', {'type' => 'error', 'errors' => message.errors.full_messages, 'user_id' => current_user.udid}.to_json)
          end
        when 'typing'
          Redis.new.publish('event_1', {'type' => 'typing', 'user_id' => current_user.udid, 'user_name' => current_user.name, 'message' => message['message'], 'user_photo' => current_user.photo(nil)}.to_json)
        when 'event'
          if current_user.can_edit_event
            event = Event.last
            if event.update_attributes({video_url: message['video_url'], name: message['event_name']})
              Redis.new.publish('event_1', {'type' => 'event', 'video_url' => event.video_url, 'event_name' => event.name, 'user_id' => current_user.udid, 'user_name' => current_user.name}.to_json)
            else
              Redis.new.publish('event_1', {'type' => 'error', 'errors' => event.errors.full_messages, 'user_id' => current_user.udid}.to_json)
            end
          end
        when 'delete'
          target_message = current_user.messages.find(message['id'])
          puts target_message.inspect
          if target_message.nil?
            Redis.new.publish('event_1', {'type' => 'error', 'errors' => ['Ocorreu um erro ao deletar.'], 'user_id' => current_user.udid}.to_json)
          else
            target_message.destroy
          end
        end
      end
      
      tubesock.onclose do
        redis_thread.kill
      end
    end
  end
  
end