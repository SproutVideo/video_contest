# Load the rails application
require File.expand_path('../application', __FILE__)

# Initialize the rails application
VideoContest::Application.initialize!
FIREFLY = Firefly::Client.new("http://vids.io", ENV['FIREFLY_KEY'])