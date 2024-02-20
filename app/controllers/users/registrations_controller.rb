class Users::RegistrationsController < Devise::RegistrationsController
   layout 'admin'
  
  def create
    build_resource(sign_up_params)
    # resource.skip_confirmation_notification!
    if resource.save
      redirect_to new_user_session_path, notice: "Your request has been made, you will have your login access once admin approve your request."
    else
      render :new
    end
  end

   def new_user
      @user = User.new
      render 'new_user'
   end

   def create_user
    build_resource(sign_up_params)
     unless sign_up_params[:password] == sign_up_params[:password_confirmation]
        resource.errors.add(:password, "Confirm does not match")
        render 'new_user'
      else
         if resource.save
          sign_in(resource)
           redirect_to root_path
        else
         render 'new_user'
       end
      end

   end

  def fetch_cities
     state = CS.states(:US).key(params[:state])
     render json: CS.cities(state, :us)
  end

   def fetch_pincodes
      state = CS.states(:US).key(params[:state]).to_s
      city = params[:city]
      render json: "#{city}, #{state}".to_zip
   end

  private

  def sign_up_params
    devise_parameter_sanitizer.sanitize(:sign_up)
  end
end