class Users::PasswordsController < Devise::PasswordsController
	layout "admin"

	def create
	 	user = User.find_by(email: params[:user][:email])

	 	if user.nil?
	 		flash[:notice] = "User not found."
      redirect_to new_user_password_path
	 	elsif user.is_approved?
			super  
		else
			flash[:notice] = "You are not approved from Admin please contact #{I18n.t(:admin_mail)}."
      redirect_to new_user_password_path
		end
	end
end
