class ApplicationController < ActionController::Base
   # require 'country_state_select'
  protect_from_forgery
  
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :authenticate_user!
  # before_action :set_default_mode

  helper_method :current_mode, :current_dashboard_url

  def current_mode
    session[:mode] ||= 'buyer'
  end

  def switch_mode
    session[:mode] = current_mode == 'buyer' ? 'seller' : 'buyer'
    redirect_to current_dashboard_url
  end

  protected


  def current_dashboard_url
    if current_mode == 'buyer'
      buyer_dashboard_path
    else
      seller_dashboard_path
    end
  end

  def after_sign_in_path_for(resource)
    if resource.is_a?(Admin)
      admin_user_lists_path
    elsif resource.is_a?(User)
        if (resource.role == "dealer")
              inventories_path
        else
            root_path
        end 
     else
         dashboard_index_path         
    end
  end

  private

  # def set_default_mode
  #   # Check if the user is signed in and if the mode is not already set
  #   if user_signed_in? && session[:mode].blank?
  #     # Set the default mode based on your logic
  #     session[:mode] = current_user.inventories.empty? ? 'buyer' : 'seller'
  #   end
  # end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: %i[dealership_name physical_address
                                                         dealership_license_number role first_name last_name phone_number website job_title company zip_code city state currently_dealer certified_dealer acquiring_inventory delivery_logistics support_billing dealer_group group_name anything_else_help])
  end

  def after_sign_out_path_for(resource)
    if resource.is_a?(Admin)
      new_admin_session_path
    elsif resource.is_a?(User)
      new_user_session_path
    else
      root_path
    end
  end

end
