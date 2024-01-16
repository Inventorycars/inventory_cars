class CreateInventories < ActiveRecord::Migration[7.0]
  def change
    create_table :inventories do |t|

      t.string :inventory_type
      t.string :stock
      t.string :vin
      t.integer :year
      t.string :make
      t.string :model
      t.string :body
      t.string :trim
      t.integer :doors
      t.string :exterior_color
      t.string :interior_color
      t.integer :engine_cylinders
      t.string :engine_displacement
      t.string :transmission
      t.integer :miles
      t.integer :price
      t.integer :msrp
      t.integer :book_value
      t.integer :invoice
      t.boolean :certified
      t.datetime :date_in_stock
      t.string :description
      t.string :options
      t.string :categorized_options
      t.string :comments
      t.string :style_description
      t.string :ext_color_generic
      t.string :ext_color_code
      t.string :ext_color_hex_code
      t.string :int_color_generic
      t.string :int_color_code
      t.string :int_color_hex_code
      t.string :int_upholstery
      t.integer :engine_block_type
      t.string :engine_aspiration_type
      t.string :engine_description
      t.integer :transmission_speed
      t.string :transmission_description
      t.string :drivetrain
      t.string :fuel_type
      t.integer :city_mpg
      t.integer :highway_mpg
      t.string :epa_classifications
      t.float :wheelbase_code
      t.integer :internet_price
      t.integer :misc_price1
      t.integer :misc_price2
      t.integer :misc_price3
      t.string :factory_codes
      t.string :market_class
      t.integer :passenger_capacity
      t.integer :engine_displacement_cubic_inches
      t.json :image_list
      t.references :user


      t.string :transmission_gear


      t.timestamps
    end
  end
end
