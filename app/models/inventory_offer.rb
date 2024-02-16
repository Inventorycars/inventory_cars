class InventoryOffer < ApplicationRecord
  belongs_to :inventory
  belongs_to :user
  delegate :user, to: :inventory, prefix: :seller, allow_nil: true
  enum status: [ :accepted, :rejected , :sent, :resent ]
  validates_uniqueness_of :user_id, scope: :inventory_id, message: "already sented offer"
  after_save :send_mail

  def send_mail
    if self.status == 'sent' || self.status == 'resent'
      OfferMailer.offer_sent(self).deliver_now
    elsif self.status == 'accepted'
      OfferMailer.offer_accepted(self).deliver_now
    elsif self.status == 'rejected'
      OfferMailer.offer_rejected(self).deliver_now
    end

  end
end