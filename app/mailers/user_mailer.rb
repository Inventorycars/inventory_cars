class UserMailer < ApplicationMailer

  def confirm_user(user)
    @email = user.email
    mail(to: user.email, subject: 'Confirmation Email')
  end
end
