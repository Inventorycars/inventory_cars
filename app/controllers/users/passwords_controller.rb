class Users::PasswordsController < Devise::PasswordsController
	layout 'home'
	 def create
	 super  
	 end
end