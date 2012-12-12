class SubmissionsController < ApplicationController
  def index
    if params[:page]
      @submissions = Submission.where('video_state = "deployed"').page(params[:page])
    else
      @submissions = Submission.where('video_state = "deployed"').limit(4)
    end
  end

  def show
    @submission = Submission.find_by_uid(params[:id])
    @voted_today = (Time.now.utc.to_date - cookies['last_voted'].to_date) < 1.day if cookies['last_voted']
    @vote = Vote.new
    respond_to do |format|
      format.html {}
      format.json {render json: {state: @submission.video_state, percent: "#{@submission.encoding_progress}%"}}
    end
  end

  def new
    @submission = Submission.new
  end
  
  def leader_board
    @submissions = Submission.all(:include => :votes, :order => 'count(votes.submission_id) DESC', :limit => 25)
  end

  def notify
    submission = Submission.find_by_uid(params[:id])
    submission.update_attribute(:sproutvideo_width, params[:width])
    submission.update_attribute(:sproutvideo_height, params[:height])
    submission.update_attribute(:sproutvideo_duration, params[:duration])
    submission.update_attribute(:video_state, params[:state])
    render :text => 'Thanks!'
  end

  def create 
    params[:submission][:ip_address] = request.remote_ip
    params[:submission][:user_agent] = request.user_agent 
    @submission = Submission.new(params[:submission])
    if @submission.save
      @submission.delay.send_to_sproutvideo
      redirect_to @submission
    else
        render action: "new"
    end
  end

end
