class AddImagesProcessedToInventories < ActiveRecord::Migration[7.0]
  def change
    add_column :inventories, :images_processed, :boolean, :default => false
  end
end
