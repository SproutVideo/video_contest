class Vote < ActiveRecord::Base
  attr_accessible :user_agent, :ip_address, :submission_id
  belongs_to :submission
end
