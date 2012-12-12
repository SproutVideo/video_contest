class VotesController < ApplicationController
  def create
    params[:vote][:ip_address] = request.remote_ip
    params[:vote][:user_agent] = request.user_agent
    
    vote = Vote.new(params[:vote])
    vote.save

    cookies.permanent[:last_voted] = Time.now.utc

    respond_to do |format|
      format.js{
        render :js => "$('.vote_form').hide();$('.vote_success').show();"
      }
    end

  end
end