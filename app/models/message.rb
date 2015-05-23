class Message < ActiveRecord::Base
  belongs_to :user
  
  validates_presence_of :message, :user_id, :event_id
  
  before_destroy do
    Redis.new.publish('event_'+self.event_id.to_s, {'type' => 'delete', 'id' => self.id}.to_json)
  end
end