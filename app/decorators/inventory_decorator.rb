class InventoryDecorator < Draper::Decorator
  delegate_all

  def image
    if object.images_processed?
      blob = object.image_list.first
      blob.nil? ? nil : h.rails_blob_path(blob, only_path: true)
    else
      object.image_urls&.first
    end
  end

  def images
    if object.images_processed?
      blobs = ActiveStorage::Blob.joins(:attachments).where(active_storage_attachments: { record_id: object.id, record_type: object.class.name, name: 'image_list' })
      blobs.map do |image|
        h.rails_blob_path(image, only_path: true)
      end
    else
      object.image_urls
    end
  end

  def model
    object.model
  end

end
