class Message < ActiveRecord::Base
  belongs_to :user
  belongs_to :event
  
  validates_presence_of :message, if: 'image.blank?'
  validates_presence_of :user_id, :event_id
  
  mount_uploader :image, MessageImageUploader
  
  before_destroy do
    Redis.new.publish('event_'+self.event_id.to_s, {'type' => 'delete', 'id' => self.id}.to_json)
  end
  
  after_commit on: :create do
    Redis.new.publish('event_'+self.event_id.to_s, {'type' => 'message', 'id' => self.id, 'user_name' => self.user.name, 'user_id' => self.user.udid, 'message' => self.message, 'image' => (self.image? ? self.image.content.url : ''), 'created_at' => self.created_at.to_i, 'user_photo' => self.user.photo(nil)}.to_json)
  end
  
  # ActionController::Base.helpers.simple_format
end