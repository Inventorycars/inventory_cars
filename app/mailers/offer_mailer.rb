class OfferMailer < ApplicationMailer

	def offer_sent(offer)
	 @offer_id = offer.id
     @first_name = offer.seller_user.first_name
     @last_name = offer.seller_user.last_name
     @email = offer.seller_user.email
     @inventory = offer.inventory
     mail(to: @email, subject: 'One offer found for your inventory') do |format|
        format.html { render 'offer_sent' }
      end
    end

    def offer_sent_to_admin(offer)
      @offer = offer.offer
      @seller_first_name = offer.seller_user.first_name
      @seller_last_name = offer.seller_user.last_name
      @seller_email = offer.seller_user.email
      @user_first_name = offer.user.first_name
      @user_last_name = offer.user.last_name
      @user_email = offer.user.email
      @inventory_owner_email = "anusha@simplyalliacess.com"
      @offer_price = offer.offer
      @inventory = offer.inventory

      mail(to: @inventory_owner_email, subject: 'One offer found for inventory') do |format|
        format.html { render 'offer_sent_admin' }
      end
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