class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :registerable and :omniauthable
  devise :database_authenticatable, :recoverable, :rememberable, :trackable, :validatable
  
  has_many :messages
  
  def udid
    self.name.parameterize
  end
  
  def photo width = 100, height = nil
    height = width if height.nil?
    return "http://graph.facebook.com/v2.2/#{self.facebook_uid}/picture?"+(width.nil? ? 'type=square' : "width=#{width}&height=#{height}")
  end
end
