class AddStateToInventories < ActiveRecord::Migration[7.0]
  def change
    add_column :inventories, :state, :string
  end
end
