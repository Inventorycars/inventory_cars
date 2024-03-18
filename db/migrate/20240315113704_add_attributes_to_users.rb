class AddAttributesToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :acquiring_inventory, :boolean
    add_column :users, :delivery_logistics, :boolean
    add_column :users, :support_billing, :boolean
    add_column :users, :currently_dealer, :boolean
  end
end
