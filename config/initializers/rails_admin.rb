RailsAdmin.config do |config|
  config.asset_source = :importmap

  config.actions do
    all
    import
    member :confirm_user do
      only 'User'
      controller do
        proc do
          @object.update(confirmed_at: Time.zone.now)
          UserMailer.confirm_user(@object).deliver_now
          flash[:success] = "User confirmed successfully."
          redirect_to back_or_index
        end
      end
    end
  end

  config.model 'User' do
    list do
      scopes [:confirmed, :unconfirmed]
      field :id
      field :email
      field :dealership_name
      field :physical_address
      field :dealership_license_number
      field :unconfirmed_user_link do
        label 'Confirmation'
        pretty_value do
          if bindings[:object].confirmed_at.nil?
            action_url = bindings[:view].rails_admin.url_for(action: 'confirm_user', model_name: 'user', controller: 'rails_admin/main', id: bindings[:object].id)
            bindings[:view].link_to('Approve this user', action_url, data: { confirm: 'Are you sure you want to confirm this user?' })
          else
            'Already Approved'
          end
        end
      end
    end
  end

  config.model 'Inventory' do
    import do
     include_all_fields
    end
  end

  config.configure_with(:import) do |config|
    config.logging = true
    config.pass_filename = true
  end

  config.configure_with(:import) do |config|
    config.logging = true
    config.line_item_limit = 1000
    config.update_if_exists = false
    config.pass_filename = false
    config.rollback_on_error = true
    config.header_converter = lambda do |header|
      header.parameterize.underscore if header.present?
    end
    config.csv_options = {}
  end

  ### Popular gems integration

  ## == Devise ==
  config.authenticate_with do
    warden.authenticate! scope: :admin
  end
  config.current_user_method(&:current_admin)
  config.included_models = ['User', 'Inventory']

  config.authorize_with do
    # redirect_to main_app.root_path unless current_user.try(:admin?)
    # redirect_to main_app.new_admin_session_path unless request.path =~ /\/admin/ && (current_admin.try(:admin?) || request.path == '/admin/login')
  end

  ## == CancanCan ==
  # config.authorize_with :cancancan

  ## == Pundit ==
  # config.authorize_with :pundit

  ## == PaperTrail ==
  # config.audit_with :paper_trail, 'User', 'PaperTrail::Version' # PaperTrail >= 3.0.0

  ### More at https://github.com/railsadminteam/rails_admin/wiki/Base-configuration

  ## == Gravatar integration ==
  ## To disable Gravatar integration in Navigation Bar set to false
  # config.show_gravatar = true

  # config/initializers/rails_admin.rb

  # config.authorize_with do
  #   # unless current_user.admin?
  #   #   redirect_to main_app.root_path, alert: 'You are not authorized to access this page.'
  #   # end
  # end

end
