class HomeController < ApplicationController
    skip_before_action :authenticate_user!
  
    def index
      @inventories = Inventory.all.limit(10)
    end

    def cars_home
      @inventories = Inventory.paginate(page: params[:page], per_page: 18)
    end

   def car_details
    inventory = Inventory.find_by(id: params[:id])
    related_inventories = Inventory.where(make: inventory.make, year: inventory.year,fuel_type: inventory.fuel_type, transmission: inventory.transmission, model: inventory.model).limit(3)
    @data = { inventory: inventory, related_inventories: related_inventories }
   end
end
