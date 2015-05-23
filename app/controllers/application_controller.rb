class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  
  layout :set_layout
  
  def set_layout
    if params[:controller] =~ /admin/
      'admin'
    elsif params[:controller] =~ /devise/ && !(params[:controller] == 'devise/registrations' && params[:action] == 'edit')
      'login'
    else
      'application'
    end
  end
end