require 'open-uri'
require 'net/http'

class Inventory < ApplicationRecord
  include AASM

  serialize :image_urls, JSON

  belongs_to :user
  has_many_attached :image_list

  scope :live, -> {where(listed: true)}
  scope :pause, -> {where(listed: false)}

  # use aasm on column state and define states finalized, step_1, step_2, step_3, with initail state as step_1
  aasm column: :state, whiny_transitions: false do
    state :step_1, initial: true
    state :step_2
    state :step_3
    state :step_4
    state :finalized
    state :live

    # before transition to step 2 validate it has image_list attached (image list can be multiple images)
    event :step_2 do
      transitions from: :step_1, to: :step_2, guard: :image_list_attached?, after: :set_image_processed
    end

    # before transition to step 3 validate it has condition, year make, engine description added
    event :step_3 do
      transitions from: :step_2, to: :step_3, guard: :condition_year_make_engine_description_present?
    end

    # before transition to finalized validate it has transmission, fule type, body shape added
    event :step_4 do
      transitions from: :step_3, to: :step_4, guard: :transmission_fule_type_body_shape_present?
    end

    # before transition to step 4 validate it has drive train, interior color, trim, vin added
    event :finalize do
      transitions from: :step_4, to: :finalized, guard: :vin_drive_train_interior_color_trim_present?
    end

    event :pause do
      transitions from: :live, to: :paused
    end

  end

  def set_image_processed
    self.images_processed = true
    self.save!
  end

  def image_list_attached?
    image_list.attached?
  end

  def condition_year_make_engine_description_present?
    inventory_type.present? && year.present? && engine_description.present?
  end

  def vin_drive_train_interior_color_trim_present?
    vin.present? && drivetrain.present? && interior_color.present? && trim.present?
  end

  def transmission_fule_type_body_shape_present?
    transmission.present? && fuel_type.present? && body.present?
  end


  def before_import_associations(record)
    self.user = User.find_by(email: record[:dealer_email])
  end

  def before_import_save(record)
    mapping = csv_mapper
    mapping.each do |key, value|
      next unless record[key].present?

      self.send("#{value}=", record[key])
    end
    if record[:imagelist].present?
      self.image_urls = record[:imagelist].split(',')


      # move the following code to a service or worker which runs in background

      # record[:imagelist].split(',').each_with_index do |image, index|
      #   begin
      #     downloaded_image = URI.open(image)
      #   rescue Exception
      #     next
      #     puts "Error importing image #{image}"
      #   end
      #   self.image_list.attach(io: downloaded_image, filename: "image#{index}.jpg")
      # end
    end

  end

  def csv_mapper
    {
      :type => "inventory_type",
      :interiorcolor => "interior_color",
      :exteriorcolor => "exterior_color",
      :enginedisplacement => "engine_displacement",
      :sellingprice => "price",
      :bookvalue => "book_value",
      :dateinstock => "date_in_stock",
      :citympg => "city_mpg",
      :highwaympg => "highway_mpg",
      :epaclassification => "epa_classifications",
      :marketclass => "market_class",
      :passengercapacity => "passenger_capacity",
    }
  end

  def csv_upload_mapper
    {"Type" => "inventory_type",
      "Stock" => "stock",
      "VIN" => "vin",
      "Year" => "year",
      "Make" =>"make",
      "Model" => "model",
      "Body" => "body",
      "Trim" => "trim",
      "Doors" =>"doors",
      "ExteriorColor" =>"exterior_color",
      "InteriorColor" =>"interior_color",
      "EngineCylinders" =>"engine_cylinders",
      "EngineDisplacement" =>"engine_displacement",
      "Transmission" =>"transmission",
      "Miles" =>"miles",
      "SellingPrice" =>"price",
      "MSRP" =>"msrp",
      "BookValue" =>"book_value",
      "Invoice" =>"invoice",
      "Certified" =>"certified",
      "DateInStock" =>"date_in_stock",
      "Description" =>"description",
      "Options" =>"options",
      "Categorized Options" =>"categorized_options",
      "Comments"=> "comments",
      "Style_Description" =>"style_description",
      "Ext_Color_Generic" =>"ext_color_generic",
      "Ext_Color_Code" =>"ext_color_code",
      "ExtColorHexCode" =>"ext_color_hex_code",
      "Int_Color_Generic" =>"int_color_generic",
      "Int_Color_Code" =>"int_color_code",
      "IntColorHexCode" =>"int_color_hex_code",
      "Int_Upholstery" =>"int_upholstery",
      "Engine_Block_Type" =>"engine_block_type",
      "Engine_Aspiration_Type" =>"engine_aspiration_type",
      "Engine_Description" =>"engine_description",
      "Transmission_Speed" =>"transmission_speed",
      "Transmission_Description" =>"transmission_description",
      "Drivetrain" =>"drivetrain",
      "Fuel_Type" =>"fuel_type",
      "CityMPG" =>"city_mpg",
      "HighwayMPG" =>"highway_mpg",
      "EPAClassification" =>"epa_classifications",
      "WheelBase_Code" =>"wheelbase_code",
      "Internet_Price" =>"internet_price",
      "Misc_Price1" =>"misc_price1",
      "Misc_Price2" =>"misc_price2",
      "Misc_Price3" =>"misc_price3",
      "Factory_Codes" =>"factory_codes",
      "MarketClass" =>"market_class",
      "PassengerCapacity" =>"passenger_capacity",
      "EngineDisplacementCubicInches" =>"engine_displacement_cubic_inches",
    }
  end
end
