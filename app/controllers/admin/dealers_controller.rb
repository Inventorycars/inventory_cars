class Admin::DealersController < ApplicationController
  layout "admin"
  skip_before_action :configure_permitted_parameters, if: :devise_controller?
  skip_before_action :authenticate_user!
  skip_before_action :set_default_mode
  before_action :authenticate_admin!


  def index
    @users = User.where(is_approved: false).page params[:page]
  end

  def approve
    user = User.find_by(id: params[:id])
    if user.present?
      raw, hashed = Devise.token_generator.generate(User, :reset_password_token)
      user.reset_password_token = hashed
      user.reset_password_sent_at = Time.now
      user.is_approved = true
      user.save
      UserMailer.reset_password(user, raw).deliver_now
    end
    redirect_to admin_user_lists_path
  end

  def reject
    byebug
    user = User.find_by(id: params[:id])
    user.update(is_approved: false)
    redirect_to admin_user_lists_path
  end

  def user_list
    @users = User.paginate(page: params[:page], per_page: 10)
  end
end
