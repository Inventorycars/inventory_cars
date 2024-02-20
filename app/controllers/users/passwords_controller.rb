class Users::PasswordsController < Devise::PasswordsController
	layout "admin"
	 def create
	 super  
	 end
end