class AddHomenetEmailToUser < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :homenet_email, :string
  end
end
