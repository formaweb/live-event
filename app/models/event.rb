class Event < ActiveRecord::Base
  
  validates_presence_of :name
  validate :youtube_video_url
  
  private
  def verify_video_http
    self.video_url = "http://" + self.video_url if self.video_url !~ /^[http:\/\/|https:\/\/]/
  end
  
  def youtube_video_url
    return if self.video_url.blank?
    
    verify_video_http
    return if(self.video_url =~ /\A(https?):\/\/(www.)?(youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]*)(\&\S+)?.*/)
    errors.add(:video_url, 'deve ser uma URL do YouTube')
  end
  
end