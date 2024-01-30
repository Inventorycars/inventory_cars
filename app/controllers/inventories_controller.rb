class InventoriesController < ApplicationController
  before_action :set_inventory, only: %i[ show edit update destroy next_step ]
   layout 'admin'
  # GET /inventories or /inventories.json
  def index
    @inventories = current_user.inventories.paginate(page: params[:page], per_page: 10)
  end

  # GET /inventories/1 or /inventories/1.json
  def show
    @inventory = @inventory.decorate
    @other_inventories = InventorySearch.new(user_id: @inventory.user_id, exclude_id: @inventory.id, limit: 10).results
  end

  # GET /inventories/new
  def new
    @inventory = current_user.inventories.new # Inventory.new
  end

  # GET /inventories/1/edit
  def edit
  end

  # POST /inventories or /inventories.json
  def create
    @inventory = current_user.inventories.new(inventory_params)

    if @inventory.save && @inventory.step_2!
      render turbo_stream: turbo_stream.update('inventory_form', partial: 'inventories/form_steps/2', locals: { inventory: @inventory, step: @step })
    else
      render turbo_stream: turbo_stream.update('inventory_form', partial: 'inventories/form_steps/1', locals: { inventory: @inventory, step: @step })
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

  # PATCH/PUT /inventories/1 or /inventories/1.json
  def update
    if @inventory.update(inventory_params) && @inventory.finalize!
      redirect_to inventory_url(@inventory), notice: "Inventory was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /inventories/1 or /inventories/1.json
  def destroy
    @inventory.destroy

    respond_to do |format|
      format.html { redirect_to inventories_url, notice: "Inventory was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  def download_sample_csv
    send_file(
      "#{Rails.root}/public/sample.csv",
      filename: "sample.csv",
      type: "text/csv"
    )
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_inventory
      @inventory = Inventory.find(params[:id])
    end

    def inventory_search_params
      params.require(:inventory_search).permit(:text, :dealership_state, :from_year, :to_year, :company, :min_price, :max_price, :sort)
    end

    # Only allow a list of trusted parameters through.
    def inventory_params
      params.require(:inventory).permit(:inventory_type, :stock, :vin, :year, :make, :model, :body, :trim, :doors, :exterior_color, :interior_color, :engine_cylinders, :engine_displacement, :transmission, :miles, :price, :msrp, :book_value, :invoice, :certified, :date_in_stock, :description, :options, :categorize_options, :comments, :style_description, :ext_color_generic, :ext_color_code, :ext_color_hex_code, :int_color_generic, :int_color_code, :int_color_hex_code, :int_upholstery, :engine_block_type, :engine_aspiration_type, :engine_description, :transmission_speed, :transmission_description, :drivetrain, :fuel_type, :city_mpg, :highway_mpg, :epa_classifications, :wheelbase_code, :internet_price, :misc_price1, :misc_price2, :mise_price3, :factory_codes, :market_class, :passenger_capacity, :engine_displacement_cubic_inches, :transmission_gear, :image_list => [])
    end
end
