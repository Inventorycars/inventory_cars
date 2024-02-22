class InventoriesController < ApplicationController
  before_action :set_inventory, only: %i[ show edit update destroy next_step ]
  
   layout 'admin'
  def index
    @inventories = Inventory.paginate(page: params[:page], per_page: 16).order(created_at: :desc)
  end

  def my_inventories
    @inventories = current_user.inventories.paginate(page: params[:page], per_page: 15).order(created_at: :desc)
    render :index
  end

  def show
    @inventory = @inventory.decorate
    # @other_inventories = InventorySearch.new(user_id: @inventory.user_id, exclude_id: @inventory.id, limit: 10).results
  end

  def new
    @inventory = current_user.inventories.new # Inventory.new
  end

  def edit
  end

  def create
    @inventory = current_user.inventories.new(inventory_params)

    if @inventory.save #&& @inventory.step_2!
      redirect_to root_path, notice: "Inventory was successfully created."
      # render turbo_stream: turbo_stream.update('inventory_form', partial: 'inventories/form_steps/2', locals: { inventory: @inventory, step: @step })
    else
      render :new, status: :unprocessable_entity
      # render turbo_stream: turbo_stream.update('inventory_form', partial: 'inventories/form_steps/1', locals: { inventory: @inventory, step: @step })
    end

  end

  def upload_csv
  end

  def attach_csv
    uploaded_file = params[:csv_file]
    if uploaded_file && uploaded_file.content_type == 'text/csv'
      csv_data = CSV.read(uploaded_file.path, headers: true)
      csv_data.each do |row|
        inventory = Inventory.new
        csv_mapper = inventory.csv_upload_mapper
        csv_mapper.each do |key, value|
      puts key
          inventory.send("#{value}=", row[key]) unless value.include?("image_list")
        end
        if row['ImageList'].present?
          inventory.image_urls = row['ImageList'].split(',')
        end
        inventory.user = current_user
        inventory.save
      end
      # InventoryImages::ProcessImages.new.call
      redirect_to '/inventories', notice: "Inventory successfully Uploaded"
    else
      redirect_to upload_csv_inventories_path, notice: "Upload csv format only"
    end
  end

  def next_step
    @step = params[:step].to_i
    next_step = "step_#{@step + 1}!"

    if @inventory.update(inventory_params) && @inventory.send(next_step)
      render turbo_stream: turbo_stream.update('inventory_form', partial: "inventories/form_steps/#{@step + 1}", locals: { inventory: @inventory, step: @step })
    else
      render turbo_stream: turbo_stream.update('inventory_form', partial: "inventories/form_steps/#{@step}", locals: { inventory: @inventory, step: @step })
    end
  end

  def search
    @inventories = InventorySearch.new(inventory_search_params.merge({exclude_user_id: current_user.id})).results
    render turbo_stream: turbo_stream.update('inventories', partial: 'inventories/inventories')
  end

  def update
    if @inventory.update(inventory_params)# && @inventory.finalized?
      redirect_to inventory_url(@inventory), notice: "Inventory was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @inventory.destroy
    respond_to do |format|
      format.turbo_stream { render turbo_stream: turbo_stream.remove(@inventory) }
      format.html { redirect_to root_path, notice: "Inventory was successfully removed." }
    end
  end

  def download_sample_csv
    send_file(
      "#{Rails.root}/public/sample.csv",
      filename: "sample.csv",
      type: "text/csv"
    )
  end

  def batch_delete
  end

  def filtered_data
    @brand = params[:brand]
    @price = params[:price]
    @year = params[:year]
    @transmission = params[:transmission]
    @engine_type = params[:engine_type]
    @miles_driven = params[:miles_driven]
    @fuel_type = params[:fuel_type]
    @inventories = Inventory.paginate(page: params[:page], per_page: 18).order(created_at: :desc)

    @inventories = @inventories.where(make: @brand) if @brand.present?
    @inventories = @inventories.where('price <= ?', @price.to_i) if  @price.to_i > 0
    @inventories = @inventories.where(year: @year) if @year.present?
    @inventories = @inventories.where(transmission: @transmission) if @transmission.present?
    @inventories = @inventories.where(engine_cylinders: @engine_type) if @engine_type.present?
    @inventories = @inventories.where(miles: @miles_driven) if @miles_driven.present?
    @inventories = @inventories.where(fuel_type: @fuel_type) if @fuel_type.present?
    render 'index'
  end

  private
    def set_inventory
      @inventory = Inventory.find(params[:id])
    end

    def inventory_search_params
      params.require(:inventory_search).permit(:text, :dealership_state, :from_year, :to_year, :company, :min_price, :max_price, :sort)
    end

    def inventory_params
      params.require(:inventory).permit(:inventory_type, :stock, :vin, :year, :make, :model, :body, :trim, :doors, :exterior_color, :interior_color, :engine_cylinders, :engine_displacement, :transmission, :miles, :price, :msrp, :book_value, :invoice, :certified, :date_in_stock, :description, :options, :categorize_options, :comments, :style_description, :ext_color_generic, :ext_color_code, :ext_color_hex_code, :int_color_generic, :int_color_code, :int_color_hex_code, :int_upholstery, :engine_block_type, :engine_aspiration_type, :engine_description, :transmission_speed, :transmission_description, :drivetrain, :fuel_type, :city_mpg, :highway_mpg, :epa_classifications, :wheelbase_code, :internet_price, :misc_price1, :misc_price2, :mise_price3, :factory_codes, :market_class, :passenger_capacity, :engine_displacement_cubic_inches, :transmission_gear, image_list: [])
    end
end
