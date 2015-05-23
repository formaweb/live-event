module ApplicationHelper

  def section_label
    "#{controller_name} #{params[:action].gsub(/_/, " ")}"
  end

end
