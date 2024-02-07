class HomeController < ApplicationController
    skip_before_action :authenticate_user!
	
    def index
		@inventories = Inventory.all.limit(10)
	end

	def cars_home
		@inventories = Inventory.paginate(page: params[:page], per_page: 18)
	end

	def car_details
		@inventory = Inventory.find_by(id: params[:id])
	end
end
