require "test_helper"

class InventoriesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @inventory = inventories(:one)
  end

  test "should get index" do
    get inventories_url
    assert_response :success
  end

  test "should get new" do
    get new_inventory_url
    assert_response :success
  end

  test "should create inventory" do
    assert_difference("Inventory.count") do
      post inventories_url, params: { inventory: { body: @inventory.body, book_value: @inventory.book_value, categorized_options: @inventory.categorized_options, certified: @inventory.certified, city_mpg: @inventory.city_mpg, comments: @inventory.comments, date_in_stock: @inventory.date_in_stock, description: @inventory.description, doors: @inventory.doors, drivetrain: @inventory.drivetrain, engine_aspiration_type: @inventory.engine_aspiration_type, engine_block_type: @inventory.engine_block_type, engine_cylinders: @inventory.engine_cylinders, engine_description: @inventory.engine_description, engine_displacement: @inventory.engine_displacement, engine_displacement_cubic_inches: @inventory.engine_displacement_cubic_inches, epa_classifications: @inventory.epa_classifications, ext_color_code: @inventory.ext_color_code, ext_color_generic: @inventory.ext_color_generic, ext_color_hex_code: @inventory.ext_color_hex_code, exterior_color: @inventory.exterior_color, factory_codes: @inventory.factory_codes, fuel_type: @inventory.fuel_type, highway_mpg: @inventory.highway_mpg, image_list: @inventory.image_list, int_color_code: @inventory.int_color_code, int_color_generic: @inventory.int_color_generic, int_color_hex_code: @inventory.int_color_hex_code, int_upholstery: @inventory.int_upholstery, interior_color: @inventory.interior_color, internet_price: @inventory.internet_price, inventory_type: @inventory.inventory_type, invoice: @inventory.invoice, make: @inventory.make, market_class: @inventory.market_class, miles: @inventory.miles, misc_price1: @inventory.misc_price1, misc_price3: @inventory.misc_price2, misc_price3: @inventory.misc_price3, model: @inventory.model, msrp: @inventory.msrp, options: @inventory.options, passenger_capacity: @inventory.passenger_capacity, price: @inventory.price, stock: @inventory.stock, style_description: @inventory.style_description, transmission: @inventory.transmission, transmission_description: @inventory.transmission_description, transmission_gear: @inventory.transmission_gear, transmission_speed: @inventory.transmission_speed, trim: @inventory.trim, user_id: @inventory.user_id, vin: @inventory.vin, wheelbase_code: @inventory.wheelbase_code, year: @inventory.year } }
    end

    assert_redirected_to inventory_url(Inventory.last)
  end

  test "should show inventory" do
    get inventory_url(@inventory)
    assert_response :success
  end

  test "should get edit" do
    get edit_inventory_url(@inventory)
    assert_response :success
  end

  test "should update inventory" do
    patch inventory_url(@inventory), params: { inventory: { body: @inventory.body, book_value: @inventory.book_value, categorized_options: @inventory.categorized_options, certified: @inventory.certified, city_mpg: @inventory.city_mpg, comments: @inventory.comments, date_in_stock: @inventory.date_in_stock, description: @inventory.description, doors: @inventory.doors, drivetrain: @inventory.drivetrain, engine_aspiration_type: @inventory.engine_aspiration_type, engine_block_type: @inventory.engine_block_type, engine_cylinders: @inventory.engine_cylinders, engine_description: @inventory.engine_description, engine_displacement: @inventory.engine_displacement, engine_displacement_cubic_inches: @inventory.engine_displacement_cubic_inches, epa_classifications: @inventory.epa_classifications, ext_color_code: @inventory.ext_color_code, ext_color_generic: @inventory.ext_color_generic, ext_color_hex_code: @inventory.ext_color_hex_code, exterior_color: @inventory.exterior_color, factory_codes: @inventory.factory_codes, fuel_type: @inventory.fuel_type, highway_mpg: @inventory.highway_mpg, image_list: @inventory.image_list, int_color_code: @inventory.int_color_code, int_color_generic: @inventory.int_color_generic, int_color_hex_code: @inventory.int_color_hex_code, int_upholstery: @inventory.int_upholstery, interior_color: @inventory.interior_color, internet_price: @inventory.internet_price, inventory_type: @inventory.inventory_type, invoice: @inventory.invoice, make: @inventory.make, market_class: @inventory.market_class, miles: @inventory.miles, misc_price1: @inventory.misc_price1, misc_price3: @inventory.misc_price3, misc_price3: @inventory.misc_price3, model: @inventory.model, msrp: @inventory.msrp, options: @inventory.options, passenger_capacity: @inventory.passenger_capacity, price: @inventory.price, stock: @inventory.stock, style_description: @inventory.style_description, transmission: @inventory.transmission, transmission_description: @inventory.transmission_description, transmission_gear: @inventory.transmission_gear, transmission_speed: @inventory.transmission_speed, trim: @inventory.trim, user_id: @inventory.user_id, vin: @inventory.vin, wheelbase_code: @inventory.wheelbase_code, year: @inventory.year } }
    assert_redirected_to inventory_url(@inventory)
  end

  test "should destroy inventory" do
    assert_difference("Inventory.count", -1) do
      delete inventory_url(@inventory)
    end

    assert_redirected_to inventories_url
  end
end
