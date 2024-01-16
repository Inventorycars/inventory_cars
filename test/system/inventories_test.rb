require "application_system_test_case"

class InventoriesTest < ApplicationSystemTestCase
  setup do
    @inventory = inventories(:one)
  end

  test "visiting the index" do
    visit inventories_url
    assert_selector "h1", text: "Inventories"
  end

  test "should create inventory" do
    visit inventories_url
    click_on "New inventory"

    fill_in "Body", with: @inventory.body
    fill_in "Book value", with: @inventory.book_value
    fill_in "Categorize options", with: @inventory.categorized_options
    check "Certified" if @inventory.certified
    fill_in "City mpg", with: @inventory.city_mpg
    fill_in "Comments", with: @inventory.comments
    fill_in "Date in stock", with: @inventory.date_in_stock
    fill_in "Description", with: @inventory.description
    fill_in "Doors", with: @inventory.doors
    fill_in "Drivetrain", with: @inventory.drivetrain
    fill_in "Engine aspiration type", with: @inventory.engine_aspiration_type
    fill_in "Engine block type", with: @inventory.engine_block_type
    fill_in "Engine cylinders", with: @inventory.engine_cylinders
    fill_in "Engine description", with: @inventory.engine_description
    fill_in "Engine displacement", with: @inventory.engine_displacement
    fill_in "Engine displacement cubic inches", with: @inventory.engine_displacement_cubic_inches
    fill_in "Epa classifications", with: @inventory.epa_classifications
    fill_in "Ext color code", with: @inventory.ext_color_code
    fill_in "Ext color generic", with: @inventory.ext_color_generic
    fill_in "Ext color hex code", with: @inventory.ext_color_hex_code
    fill_in "Exterior color", with: @inventory.exterior_color
    fill_in "Factory codes", with: @inventory.factory_codes
    fill_in "Fuel type", with: @inventory.fuel_type
    fill_in "Highway mpg", with: @inventory.highway_mpg
    fill_in "Image list", with: @inventory.image_list
    fill_in "Int color code", with: @inventory.int_color_code
    fill_in "Int color generic", with: @inventory.int_color_generic
    fill_in "Int color hex code", with: @inventory.int_color_hex_code
    fill_in "Int upholstery", with: @inventory.int_upholstery
    fill_in "Interior color", with: @inventory.interior_color
    fill_in "Internet price", with: @inventory.internet_price
    fill_in "Inventory type", with: @inventory.inventory_type
    fill_in "Invoice", with: @inventory.invoice
    fill_in "Make", with: @inventory.make
    fill_in "Market class", with: @inventory.market_class
    fill_in "Miles", with: @inventory.miles
    fill_in "Mise price1", with: @inventory.misc_price1
    fill_in "Mise price2", with: @inventory.misc_price2
    fill_in "Mise price3", with: @inventory.misc_price3
    fill_in "Model", with: @inventory.model
    fill_in "Msrp", with: @inventory.msrp
    fill_in "Options", with: @inventory.options
    fill_in "Passenger capacity", with: @inventory.passenger_capacity
    fill_in "Price", with: @inventory.price
    fill_in "Stock", with: @inventory.stock
    fill_in "Style description", with: @inventory.style_description
    fill_in "Transmission", with: @inventory.transmission
    fill_in "Transmission description", with: @inventory.transmission_description
    fill_in "Transmission gear", with: @inventory.transmission_gear
    fill_in "Transmission speed", with: @inventory.transmission_speed
    fill_in "Trim", with: @inventory.trim
    fill_in "User", with: @inventory.user_id
    fill_in "Vin", with: @inventory.vin
    fill_in "Wheelbase code", with: @inventory.wheelbase_code
    fill_in "Year", with: @inventory.year
    click_on "Create Inventory"

    assert_text "Inventory was successfully created"
    click_on "Back"
  end

  test "should update Inventory" do
    visit inventory_url(@inventory)
    click_on "Edit this inventory", match: :first

    fill_in "Body", with: @inventory.body
    fill_in "Book value", with: @inventory.book_value
    fill_in "Categorize options", with: @inventory.categorized_options
    check "Certified" if @inventory.certified
    fill_in "City mpg", with: @inventory.city_mpg
    fill_in "Comments", with: @inventory.comments
    fill_in "Date in stock", with: @inventory.date_in_stock
    fill_in "Description", with: @inventory.description
    fill_in "Doors", with: @inventory.doors
    fill_in "Drivetrain", with: @inventory.drivetrain
    fill_in "Engine aspiration type", with: @inventory.engine_aspiration_type
    fill_in "Engine block type", with: @inventory.engine_block_type
    fill_in "Engine cylinders", with: @inventory.engine_cylinders
    fill_in "Engine description", with: @inventory.engine_description
    fill_in "Engine displacement", with: @inventory.engine_displacement
    fill_in "Engine displacement cubic inches", with: @inventory.engine_displacement_cubic_inches
    fill_in "Epa classifications", with: @inventory.epa_classifications
    fill_in "Ext color code", with: @inventory.ext_color_code
    fill_in "Ext color generic", with: @inventory.ext_color_generic
    fill_in "Ext color hex code", with: @inventory.ext_color_hex_code
    fill_in "Exterior color", with: @inventory.exterior_color
    fill_in "Factory codes", with: @inventory.factory_codes
    fill_in "Fuel type", with: @inventory.fuel_type
    fill_in "Highway mpg", with: @inventory.highway_mpg
    fill_in "Image list", with: @inventory.image_list
    fill_in "Int color code", with: @inventory.int_color_code
    fill_in "Int color generic", with: @inventory.int_color_generic
    fill_in "Int color hex code", with: @inventory.int_color_hex_code
    fill_in "Int upholstery", with: @inventory.int_upholstery
    fill_in "Interior color", with: @inventory.interior_color
    fill_in "Internet price", with: @inventory.internet_price
    fill_in "Inventory type", with: @inventory.inventory_type
    fill_in "Invoice", with: @inventory.invoice
    fill_in "Make", with: @inventory.make
    fill_in "Market class", with: @inventory.market_class
    fill_in "Miles", with: @inventory.miles
    fill_in "Mise price1", with: @inventory.misc_price1
    fill_in "Mise price2", with: @inventory.misc_price2
    fill_in "Mise price3", with: @inventory.misc_price3
    fill_in "Model", with: @inventory.model
    fill_in "Msrp", with: @inventory.msrp
    fill_in "Options", with: @inventory.options
    fill_in "Passenger capacity", with: @inventory.passenger_capacity
    fill_in "Price", with: @inventory.price
    fill_in "Stock", with: @inventory.stock
    fill_in "Style description", with: @inventory.style_description
    fill_in "Transmission", with: @inventory.transmission
    fill_in "Transmission description", with: @inventory.transmission_description
    fill_in "Transmission gear", with: @inventory.transmission_gear
    fill_in "Transmission speed", with: @inventory.transmission_speed
    fill_in "Trim", with: @inventory.trim
    fill_in "User", with: @inventory.user_id
    fill_in "Vin", with: @inventory.vin
    fill_in "Wheelbase code", with: @inventory.wheelbase_code
    fill_in "Year", with: @inventory.year
    click_on "Update Inventory"

    assert_text "Inventory was successfully updated"
    click_on "Back"
  end

  test "should destroy Inventory" do
    visit inventory_url(@inventory)
    click_on "Destroy this inventory", match: :first

    assert_text "Inventory was successfully destroyed"
  end
end
