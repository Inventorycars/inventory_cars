module InventoryImages
  class ProcessImages
    def initialize
      @slices_count = 5
      @data = []
    end

    def call
      formatted_data.each do |data|
        AttachInventoryImagesJob.perform_async(data)
      end
      Inventory.where(image_urls: nil).update(images_processed: true)
    end

    private

    def formatted_data
      image_urls = Inventory.where(images_processed: false).where.not(image_urls: nil).pluck(:id, :image_urls).to_h
      image_urls.each do |id, urls|
        urls.each do |url|
          @data << { "id" => id, "url" => url }
        end
      end
      @data.each_slice(@data.size / @slices_count).to_a unless @data.empty?
    end

  end
end
