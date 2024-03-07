class OfferMailer < ApplicationMailer

	def offer_sent(offer)
		@offer_id = offer.id
    @first_name = offer.seller_user.first_name
    @last_name = offer.seller_user.last_name
    @email = offer.seller_user.email
    @inventory = offer.inventory
    mail(to: @email, subject: 'One offer found for your inventory')
  end

  def offer_accept_details(offer)
    @offer_id = offer.id
    @first_name = offer.seller_user.first_name
    @last_name = offer.seller_user.last_name
    @email = offer.seller_user.email
    @inventory = offer.inventory
    mail(to: @email, subject: 'One offer found for your inventory') do |format|
    format.html{ render 'offer_accept_details'}
  end
  end

  def offer_accepted(offer)
		@offer_id = offer.id
    @first_name = offer.user.first_name
    @last_name = offer.user.last_name
    @email = offer.user.email
    mail(to: @email, subject: 'your offer is accepted')
  end

  def offer_rejected(offer)
	@offer_id = offer.id
    @first_name = offer.user.first_name
    @last_name = offer.user.last_name
    @email = offer.user.email
    mail(to: @email, subject: 'your offer is accepted')
  end
end