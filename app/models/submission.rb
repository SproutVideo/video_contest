class Submission < ActiveRecord::Base
  attr_accessible :title, :description, :video, :email, :ip_address, :user_agent, :company_name
  validates_presence_of :email, :title, :description, :video, :company_name
  validates_uniqueness_of :email
  validates_format_of :email, :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i, :on => :create
  has_attached_file :video
  after_create :set_uid
  has_many :votes

  def create_short_url
    resp = RestClient.get(
      'https://api-ssl.bitly.com/v3/shorten',
      :params => {
        :login => BITLY_USERNAME,
        :apiKey => BITLY_API_KEY,
        :longUrl => "http://resolutions.sproutvideo.com/submissions/#{uid}"})
    url = JSON.parse(resp.to_s)["data"]["url"]
    update_attribute(:short_url, url)
  end

  def place
    votes = Vote.count(:group => 'submission_id').sort{|a,b| b[1]<=>a[1]}.collect{|ids|ids[0]}
    place = votes.index(id)
    place.nil? ? "?" : (place+1).ordinalize
  end

  def send_to_sproutvideo
    return if !sproutvideo_id.nil?
    create_short_url
    resp = Sproutvideo::Video.create(video.path.to_s,{
      :title => title,
      :description => description,
      :notification_url => "http://ec2-23-21-158-155.compute-1.amazonaws.com//submissions/#{uid}/notify",
      :tags => '7a97d7b7f5'
      }).body
    if !!resp[:error]
      update_attribute(:video_state, "failed")
    else
      update_attribute(:sproutvideo_id, resp[:id])
      update_attribute(:sproutvideo_security_token, resp[:security_token])
      update_attribute(:sproutvideo_poster_frame_url, resp[:assets][:poster_frames][1])
      update_attribute(:video_state, 'processing')
    end
  end

  def encoding_progress
    if sproutvideo_id
      begin
        resp = Sproutvideo::Video.details(sproutvideo_id).body
      rescue
        return 0.0
      end
      unless !!resp[:error]
        resp[:progress]
      else
        0.0
      end
    else
      0.0
    end
  end

  def to_param
    (id + created_at.to_i).to_s(36)
  end

  def set_uid
    update_attribute(:uid, self.to_param)
  end
end
