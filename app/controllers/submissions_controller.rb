class SubmissionsController < ApplicationController
  def index
    if params[:page]
      @submissions = Submission.where('video_state = "deployed"').order('id DESC').page(params[:page])
    else
      @submissions = Submission.where('video_state = "deployed"').order('id DESC').limit(4)
      votes = Vote.count(:group => 'submission_id').sort{|a,b| b[1]<=>a[1]}.collect{|ids|ids[0]}
      @leaders = []
      votes[0..5].each{|submission_id| @leaders << Submission.find(submission_id)}
      
    end
  end

  def show
    @submission = Submission.find_by_uid(params[:id])
    if cookies['last_voted']
      @voted_today = (Time.now.utc.to_date - cookies['last_voted'].to_date).to_i < 1
    end
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
    votes = Vote.count(:group => 'submission_id').sort{|a,b| b[1]<=>a[1]}.collect{|ids|ids[0]}
    @leaders = []
    votes[0..19].each{|submission_id| @leaders << Submission.find(submission_id)}
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
    respond_to do |format|
      if @submission.save
        @submission.delay.send_to_sproutvideo
        format.html { redirect_to @submission }
        format.json { render json: {:submission_url => "/submissions/#{@submission.uid}"} }
      else
        format.html { render action: "new" }
        format.json { render json: @submission.errors, status: :unprocessable_entity }
      end
    end
  end

end
