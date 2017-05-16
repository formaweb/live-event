pidfile "/home/live-event/application/shared/pids/puma.pid"
threads 0, 16
bind "unix:///tmp/live_event.sock"
workers 4

on_worker_boot do
  puts "Starting puma server for Live Event..."
end
