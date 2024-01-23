class Users::SessionsController < Devise::SessionsController
 
  # def create
  #   self.resource = warden.authenticate!(auth_options)
  #   check_user_activation(resource)
  #   sign_in(resource_name, resource)
  #   yield resource if block_given?
  #   respond_with resource, location: after_sign_in_path_for(resource)
  # end

  # private

  # def check_user_activation(user)
  #   unless user.is_approved
  #     sign_out(user)
  #     flash[:alert] = "Please confirm your account first."
  #     redirect_to root_path
  #   end
  # end
end