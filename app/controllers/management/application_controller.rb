module Management
	class ApplicationController < ActionController::Management
		before_action :authenticate_admin!
	end
end

