class Users::SessionsController < Devise::SessionsController
  layout 'admin'
  def create
    resource = warden.authenticate!(auth_options)
    unless resource.is_approved
      sign_out(resource)
      flash[:icon] = "bi bi-ban"
      flash[:notice] = "Please get your account cofirm first."
      redirect_to new_user_session_path
    else
    sign_in(resource_name, resource)
       yield resource if block_given?
    respond_with resource, location: after_sign_in_path_for(resource)
  end
 end

end