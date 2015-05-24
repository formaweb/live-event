require 'bundler/capistrano'

set :application, "live-event"
set :repository,  "https://github.com/formaweb/live-event.git"
set :user, "root"
set :use_sudo, false
set :deploy_to, "/home/live-event/application"

set :scm, :git

default_run_options[:pty] = true
# ssh_options[:port] = 22022

role :web, "live-event.formaweb.com.br"                          # Your HTTP server, Apache/etc
role :app, "live-event.formaweb.com.br"                          # This may be the same as your `Web` server
role :db,  "live-event.formaweb.com.br", :primary => true        # This is where Rails migrations will run

namespace :deploy do
  task :restart, :roles => :app, :except => { :no_release => true } do
    # Create links
    run "ln -nfs #{File.join(shared_path, 'system')} #{File.join(release_path, 'public', 'system')}"
    run "ln -nfs #{File.join(shared_path, 'uploads')} #{File.join(release_path, 'public', 'uploads')}"
    
    # Set folder permissions
    run "chmod -R 777 #{File.join(shared_path, 'log')}"
    run "chmod -R 777 #{File.join(release_path, 'public')}"
    run "chmod -R 777 #{File.join(shared_path, 'uploads')}"
    run "chmod -R 777 #{File.join(shared_path, 'system')}"
    run "chmod -R 777 #{File.join(release_path, 'tmp')}"
    
    # Kill Puma
    # run "kill `cat #{File.join(shared_path, 'pids', 'puma.pid')}`"
    
    # Run migrations and database seed
    run "cd #{File.join(release_path)} && bundle exec rake db:migrate RAILS_ENV=production"
    # run "cd #{File.join(release_path)} && bundle exec rake db:seed RAILS_ENV=production"
    
    # Precompile the assets
    run "cd #{File.join(release_path)} && bundle exec rake assets:precompile RAILS_ENV=production"
    
    # Configure and reboot Nginx
    run "ln -nfs #{File.join(release_path, 'config', 'nginx.conf')} /etc/nginx/sites-enabled/live_event"
    run "/etc/init.d/nginx restart"
    
    # Start Puma
    run "cd #{File.join(release_path)} && bundle exec puma -e production -C #{File.join(release_path, 'config', 'puma.rb')} -d"
    
    # Cache clear
    run "cd #{File.join(release_path)} && bundle exec rails runner -e production 'Rails.cache.clear'"
  end
end