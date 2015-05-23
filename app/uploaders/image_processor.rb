module ImageProcessor
  protected
  def image?(new_file)
    new_file.content_type.start_with? 'image'
  end
  
  # Rotates the image based on the EXIF Orientation
  def fix_exif_rotation
    return unless self.file.content_type.start_with? 'image'
    
    manipulate! do |img|
      img.tap(&:auto_orient)
      img = yield(img) if block_given?
      img
    end
  end

  # Strips out all embedded information from the image
  def strip
    return unless self.file.content_type.start_with? 'image'

    manipulate! do |img|
      img.strip
      img = yield(img) if block_given?
      img
    end
  end
end