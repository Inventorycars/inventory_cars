class AddAdditionalFieldsToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :dealership_name, :string
    add_column :users, :physical_address, :string
    add_column :users, :dealership_license_number, :string
    add_column :users, :role, :string
  end
end
