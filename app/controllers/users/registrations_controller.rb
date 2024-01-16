class Users::RegistrationsController < Devise::RegistrationsController

  def create
    build_resource(sign_up_params)
    # resource.skip_confirmation_notification!
    if resource.save
      redirect_to new_user_session_path, alert: "Your request has been made, you will have your login access once admin approves."
    else
      render :new
    end
  end

  private

  def sign_up_params
    devise_parameter_sanitizer.sanitize(:sign_up)
  end

end