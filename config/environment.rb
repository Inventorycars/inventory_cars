# Load the Rails application.
require_relative "application"

# Initialize the Rails application.
Rails.application.initialize!
ActionMailer::Base.smtp_settings = {
  :user_name => 'apikey', # This is the string literal 'apikey', NOT the ID of your API key
  :password => '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', # This is the secret sendgrid API key which was issued during API key creation
  :domain => 'gmail.com',
  :address => 'smtp.sendgrid.net',
  :port => 587,
  :authentication => :plain,
  :enable_starttls_auto => true
}