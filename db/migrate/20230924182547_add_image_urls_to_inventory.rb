class AddImageUrlsToInventory < ActiveRecord::Migration[7.0]
  def change
    add_column :inventories, :image_urls, :text
  end
end
