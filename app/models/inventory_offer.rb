class InventoryOffer < ApplicationRecord
  belongs_to :inventory
  belongs_to :user
  delegate :user, to: :inventory, prefix: :seller, allow_nil: true
  enum status: { accepted: 0, rejected: 1, sent: 2, requote: 3 }
  validates :user_id, uniqueness: { scope: :inventory_id, message: "has already sent an offer" }
  before_validation :set_default_status, on: :create
  after_save :send_mail

  def send_mail
    if sent?
      OfferMailer.offer_sent(self).deliver_now
      OfferMailer.offer_sent_to_admin(self).deliver_now
    elsif accepted?
      OfferMailer.offer_accepted(self).deliver_now
      OfferMailer.offer_accepted_admin(self).deliver_now
    elsif rejected?
      OfferMailer.offer_rejected(self).deliver_now
      OfferMailer.offer_rejected_admin(self).deliver_now
    elsif requote?
      OfferMailer.offer_requote(self).deliver_now
      OfferMailer.offer_requote_admin(self).deliver_now  
    end
  end

  private

  def set_default_status
    self.status ||= :sent
  end
end
