# encoding: utf-8

class MessageImageUploader < CarrierWave::Uploader::Base
  include CarrierWave::MiniMagick
  include ImageProcessor

  storage :file
  
  process :fix_exif_rotation
  process :strip
  
  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end
  
  version :thumb do
    process :resize_to_fill => [93, 93]
  end
  
  version :content do
    process :resize_to_limit => [1048, 786]
    process :watermark => "#{Rails.root}/app/assets/images/watermark.png" #if model.has_watermark?
  end
  
  def watermark(wm_options)
    manipulate! do |img|
      if img[:width] > 500
        img = img.composite(MiniMagick::Image.open(wm_options), "jpg") do |c|
          c.gravity "SouthEast"
        end
      end
      img
    end
  end

  def extension_white_list
    %w(jpg jpeg gif png)
  end
end