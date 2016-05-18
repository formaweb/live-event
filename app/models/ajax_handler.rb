class AjaxHandler

  def self.process_message event, breakpoint = nil
    if breakpoint.nil?
      messages = event.messages.unscoped.limit(10)
    else
      messages = event.messages.unscoped.where('updated_at >= ?', Time.zone.at(breakpoint.to_i))
    end

    detail = []

    messages.each do |message|
      if message.deleted
        detail << { type: 'delete', id: message.id }
      else
        detail << {
          type: 'message',
          id: message.id,
          user_name: message.user.name,
          user_id: message.user.udid,
          message: message.message,
          image: (message.image? ? message.image.content.url : ''),
          created_at: message.created_at.to_i,
          user_photo: message.user.photo(nil)
        }
      end
    end

    detail << { type: 'event', event_name: event.name, video_url: event.video_url, video_id: event.get_youtube_video_id }

    return { detail: detail, timestamp: Time.zone.now.to_i }
  end

end
