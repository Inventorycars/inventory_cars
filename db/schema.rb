# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2024_01_11_113717) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "admins", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_admins_on_email", unique: true
    t.index ["reset_password_token"], name: "index_admins_on_reset_password_token", unique: true
  end

  create_table "inventories", force: :cascade do |t|
    t.string "inventory_type"
    t.string "stock"
    t.string "vin"
    t.integer "year"
    t.string "make"
    t.string "model"
    t.string "body"
    t.string "trim"
    t.integer "doors"
    t.string "exterior_color"
    t.string "interior_color"
    t.integer "engine_cylinders"
    t.string "engine_displacement"
    t.string "transmission"
    t.integer "miles"
    t.integer "price"
    t.integer "msrp"
    t.integer "book_value"
    t.integer "invoice"
    t.boolean "certified"
    t.datetime "date_in_stock"
    t.string "description"
    t.string "options"
    t.string "categorized_options"
    t.string "comments"
    t.string "style_description"
    t.string "ext_color_generic"
    t.string "ext_color_code"
    t.string "ext_color_hex_code"
    t.string "int_color_generic"
    t.string "int_color_code"
    t.string "int_color_hex_code"
    t.string "int_upholstery"
    t.integer "engine_block_type"
    t.string "engine_aspiration_type"
    t.string "engine_description"
    t.integer "transmission_speed"
    t.string "transmission_description"
    t.string "drivetrain"
    t.string "fuel_type"
    t.integer "city_mpg"
    t.integer "highway_mpg"
    t.string "epa_classifications"
    t.float "wheelbase_code"
    t.integer "internet_price"
    t.integer "misc_price1"
    t.integer "misc_price2"
    t.integer "misc_price3"
    t.string "factory_codes"
    t.string "market_class"
    t.integer "passenger_capacity"
    t.integer "engine_displacement_cubic_inches"
    t.json "image_list"
    t.bigint "user_id"
    t.string "transmission_gear"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "image_urls"
    t.boolean "images_processed", default: false
    t.boolean "listed", default: false
    t.string "state"
    t.index ["user_id"], name: "index_inventories_on_user_id"
  end

  create_table "inventory_offers", force: :cascade do |t|
    t.bigint "inventory_id", null: false
    t.bigint "user_id", null: false
    t.integer "offer"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["inventory_id"], name: "index_inventory_offers_on_inventory_id"
    t.index ["user_id"], name: "index_inventory_offers_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "dealership_name"
    t.string "physical_address"
    t.string "dealership_license_number"
    t.string "role"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.string "dealership_state"
    t.string "homenet_email"
    t.string "first_name"
    t.string "last_name"
    t.string "phone_number"
    t.string "website"
    t.string "job_title"
    t.string "company"
    t.string "zip_code"
    t.string "city"
    t.string "state"
    t.boolean "certified_dealer"
    t.boolean "dealer_group"
    t.string "group_name"
    t.string "anything_else_help"
    t.boolean "is_approved", default: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "inventory_offers", "inventories"
  add_foreign_key "inventory_offers", "users"
end
