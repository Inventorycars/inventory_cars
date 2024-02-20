class Users::SessionsController < Devise::SessionsController
  layout 'admin'
  def create
    resource = warden.authenticate!(auth_options)
     if resource.role == 'dealer'
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
    else
       sign_in(resource_name, resource)
         yield resource if block_given?
      respond_with resource, location: after_sign_in_path_for(resource)
   end
 end

 def destroy
    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
    set_flash_message! :notice, :signed_out if signed_out
    yield if block_given?
    redirect_to root_path
 end

end