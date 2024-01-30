class RegistrationsController < Devise::RegistrationsController
  layout 'admin'
  def create
    super
  end
end