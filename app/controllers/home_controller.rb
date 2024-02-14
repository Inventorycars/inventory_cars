class HomeController < ApplicationController
    skip_before_action :authenticate_user!
  
    def index
      @inventories = Inventory.all.limit(10)
    end

    def cars_home
        @inventories = Inventory.paginate(page: params[:page], per_page: 18).order(created_at: :desc)
    end

   def car_details
    inventory = Inventory.find_by(id: params[:id])
    related_inventories = Inventory.where(make: inventory.make, year: inventory.year,fuel_type: inventory.fuel_type, transmission: inventory.transmission, model: inventory.model).limit(3)
    @data = { inventory: inventory, related_inventories: related_inventories }
   end

   def filtered_data
      brand = params[:brands]
      price = params[:price]
      year = params[:year]
      transmission = params[:transmission]
      engine_type = params[:engine_type]
      miles_driven = params[:miles_driven]
      fuel_type = params[:fuel_type]
      @inventories = Inventory.paginate(page: params[:page], per_page: 18).order(created_at: :desc)
      
      @inventories = @inventories.where(make: brand) if brand.present?
      @inventories = @inventories.where('price <= ?', price.to_i) if  price.to_i > 0
      @inventories = @inventories.where(year: year) if year.present?
      @inventories = @inventories.where(transmission: transmission) if transmission.present?
      @inventories = @inventories.where(engine_type: engine_type) if engine_type.present?
      @inventories = @inventories.where(miles: miles_driven) if miles_driven.present?
      @inventories = @inventories.where(fuel_type: fuel_type) if fuel_type.present?
    render 'cars_home'
  end
end
