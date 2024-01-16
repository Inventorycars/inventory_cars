class Admin::DealersController < ApplicationController
  skip_before_action :configure_permitted_parameters, if: :devise_controller?
  skip_before_action :authenticate_user!
  skip_before_action :set_default_mode
  before_action :authenticate_admin!


  def index
    @users = User.where(is_approved: false).page params[:page]
  end

  def approved
    user = User.find_by(id: params[:id])
    if user.present?
      raw, hashed = Devise.token_generator.generate(User, :reset_password_token)
      user.reset_password_token = hashed
      user.reset_password_sent_at = Time.now
      user.is_approved = true
      user.save
      UserMailer.reset_password(user, raw).deliver_now
    end
    redirect_to admin_dealers_path
  end
end
