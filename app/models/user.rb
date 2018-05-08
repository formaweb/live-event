class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :registerable and :omniauthable
  devise :database_authenticatable, :recoverable, :rememberable, :trackable, :validatable

  has_many :messages, dependent: :destroy

  after_commit on: :update do
    Redis.new.publish('event_1', {'type' => 'user', 'user_id' => self.udid, 'user_name' => self.name, 'online' => self.online, 'user_photo' => self.photo(nil)}.to_json)
  end

  def udid
    self.name.parameterize
  end

  def photo width = 100, height = nil
    height = width if height.nil?
    return "https://graph.facebook.com/v2.2/#{self.facebook_uid}/picture?"+(width.nil? ? 'type=square' : "width=#{width}&height=#{height}")
  end
end
