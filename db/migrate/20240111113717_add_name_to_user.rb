class AddNameToUser < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :first_name, :string
    add_column :users, :last_name, :string
    add_column :users, :phone_number, :string
    add_column :users, :website, :string
    add_column :users, :job_title, :string
    add_column :users, :company, :string
    add_column :users, :zip_code, :string
    add_column :users, :city, :string
    add_column :users, :state, :string
    add_column :users, :certified_dealer, :boolean
    add_column :users, :dealer_group, :boolean
    add_column :users, :group_name, :string
    add_column :users, :anything_else_help, :string
    add_column :users, :is_approved, :boolean, default: false
  end
end

