class AddColumnStatusToInventoryOffers < ActiveRecord::Migration[7.0]
  def change
    add_column :inventory_offers, :status, :integer
    add_column :inventory_offers, :rejection_reason, :string
    change_column :inventory_offers, :offer, :integer, limit: 8
  end
end
