class AttachInventoryImagesJob
  include Sidekiq::Worker

  def perform(args)
    InventoryImages::AttachImages.new(args).attach
  end
end
