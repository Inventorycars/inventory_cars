require 'parallel'
module InventoryImages
  class AttachImages
    NUM_THREADS = 2

    def initialize(args)
      @grouped_data = args.group_by { |item| item["id"] }
    end

    def attach
      Parallel.each(@grouped_data, in_threads: NUM_THREADS) do |data|
        process_inventory_item(data)
      end
    end

    private

    def process_inventory_item(data)
      inventory_item = Inventory.find_by(id: data[0])
      return unless inventory_item

      urls = data[1].map { |array| array["url"] }
      urls.each_with_index do |image_url, index|
        import_image(inventory_item, image_url, index)
      end
      inventory_item.update(images_processed: true) unless inventory_item.images_processed
    end

    def import_image(inventory_item, image_url, index)
      begin
        downloaded_image = URI.open(image_url)
        inventory_item.image_list.attach(io: downloaded_image, filename: "image_#{index}.jpg")
        puts "Imported image: #{image_url}"
      rescue => e
        puts "Error importing image: #{image_url}, #{e.message}"
        inventory_item.image_urls.delete(image_url)
      ensure
        ActiveRecord::Base.connection.close
      end
    end
  end
end
