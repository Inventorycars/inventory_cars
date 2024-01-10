class CreateInventoryOffers < ActiveRecord::Migration[7.0]
  def change
    create_table :inventory_offers do |t|
      t.references :inventory, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.integer :offer

      t.timestamps
    end
  end
end
