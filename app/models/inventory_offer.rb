class InventoryOffer < ApplicationRecord
  belongs_to :inventory
  belongs_to :user
end
