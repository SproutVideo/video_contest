class CreateSubmissions < ActiveRecord::Migration
  def change
    create_table :submissions do |t|
      t.string :title
      t.text :description
      t.string :sproutvideo_id
      t.string :email
      t.attachment :video
      t.string :uid
      t.string :video_state, :default => 'uploading'
      t.string :sproutvideo_poster_frame_url
      t.string :sproutvideo_security_token
      t.integer :sproutvideo_width
      t.integer :sproutvideo_height
      t.float :sproutvideo_duration
      t.string :ip_address
      t.string :user_agent
      t.timestamps
    end
    add_index :submissions, :uid
  end
end
