on_app_servers do
  sudo "monit restart delayed_job1"
  run "ln -nfs /data/video_contest/shared/externals.rb  /data/video_contest/current/config/initializers/externals.rb"
end