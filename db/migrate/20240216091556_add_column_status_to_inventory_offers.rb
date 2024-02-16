class AddColumnStatusToInventoryOffers < ActiveRecord::Migration[7.0]
  def change
     add_column :inventory_offers, :status, :integer
     add_column :inventory_offers, :rejection_reason, :string
  end
end
