class SessionsController < Devise::SessionsController
  layout 'admin'
  def create
    super
  end
end