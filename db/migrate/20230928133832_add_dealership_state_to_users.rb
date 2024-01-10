class AddDealershipStateToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :dealership_state, :string
  end
end
