class HomeController < ApplicationController
    skip_before_action :authenticate_user!
	
    def index
		@inventories = Inventory.all.limit(10)
	end

	def cars_home
		@inventories = Inventory.all
	end
end
