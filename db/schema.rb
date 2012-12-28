# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20121228152557) do

  create_table "delayed_jobs", :force => true do |t|
    t.integer  "priority",   :default => 0
    t.integer  "attempts",   :default => 0
    t.text     "handler"
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.string   "queue"
    t.datetime "created_at",                :null => false
    t.datetime "updated_at",                :null => false
  end

  add_index "delayed_jobs", ["priority", "run_at"], :name => "delayed_jobs_priority"

  create_table "submissions", :force => true do |t|
    t.string   "title"
    t.text     "description"
    t.string   "sproutvideo_id"
    t.string   "email"
    t.string   "video_file_name"
    t.string   "video_content_type"
    t.integer  "video_file_size"
    t.datetime "video_updated_at"
    t.string   "uid"
    t.string   "video_state",                  :default => "uploading"
    t.string   "sproutvideo_poster_frame_url"
    t.string   "sproutvideo_security_token"
    t.integer  "sproutvideo_width"
    t.integer  "sproutvideo_height"
    t.float    "sproutvideo_duration"
    t.string   "ip_address"
    t.string   "user_agent"
    t.datetime "created_at",                                            :null => false
    t.datetime "updated_at",                                            :null => false
    t.string   "short_url"
    t.string   "company_name"
  end

  add_index "submissions", ["uid"], :name => "index_submissions_on_uid"

  create_table "votes", :force => true do |t|
    t.integer  "submission_id"
    t.string   "ip_address"
    t.string   "user_agent"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

end
