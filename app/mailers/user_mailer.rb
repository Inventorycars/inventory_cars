class UserMailer < ApplicationMailer
  def confirm_user(user)
    @email = user.email
    mail(to: user.email, subject: 'Confirmation Email')
  end

  def welcome_user(user)
    @first_name = user.first_name
    @last_name = user.last_name
    @email = user.email
    mail(to: @email, subject: 'Welcome to Inventory Cars!')
  end

  def dealer_added(user)
    @first_name = user.first_name
    @last_name = user.last_name
    mail(to: I18n.t(:admin_mail), subject: "New Dealer Registration: #{@first_name} #{@last_name}")
  end

  def reset_password(user, raw)
    @token = raw
    @email = user.email
    @first_name = user.first_name
    @last_name = user.last_name
    mail(to: @email, subject: 'Welcome to Inventory Cars - Your Account Has Been Approved!')
  end

  def reject_dealer(user)
    @first_name = user.first_name
    @last_name = user.last_name
    @email = user.email
    mail(to: @email, subject: 'Dealership Rejected')
  end
end
