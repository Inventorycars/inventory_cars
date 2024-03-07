class InventoryOffer < ApplicationRecord
  belongs_to :inventory
  belongs_to :user
  delegate :user, to: :inventory, prefix: :seller, allow_nil: true
  enum status: [ :accepted, :rejected , :sent, :resent , :requote ]
  validates_uniqueness_of :user_id, scope: :inventory_id, message: "already sented offer"
  after_save :send_mail

  def send_mail
    if sent? || resent?
      OfferMailer.offer_sent(self).deliver_now
    elsif accepted?
      OfferMailer.offer_accepted(self).deliver_now
      OfferMailer.offer_accept_details(self).deliver_now
    elsif rejected?
      OfferMailer.offer_rejected(self).deliver_now
    end

    # OfferMailer.send("offer_#{status}", self).deliver_now
  end
end