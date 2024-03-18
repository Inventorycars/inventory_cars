class OfferMailer < ApplicationMailer

	def offer_sent(offer)
	  @offer_id = offer.id
    @first_name = offer.seller_user.first_name
    @last_name = offer.seller_user.last_name
    @email = offer.seller_user.email
    @offer_price = offer.offer
    @inventory_model_name = offer.inventory.model
    mail(to: @email, subject: "Great News! You've Received an Offer on Your Inventory!") do |format|
      format.html { render 'offer_sent', layout: 'mailer'}
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
    @inventory_owner_email = "inventorycars@admin.in"
    @offer_price = offer.offer
    @inventory = offer.inventory

    mail(to: @inventory_owner_email, subject: 'One offer discovered for inventory') do |format|
      format.html { render 'offer_sent_admin' }
    end
  end

  def offer_accepted_admin(offer)
    @offer = offer.offer
    @seller_first_name = offer.seller_user.first_name
    @seller_last_name = offer.seller_user.last_name
    @seller_email = offer.seller_user.email
    @user_first_name = offer.user.first_name
    @user_last_name = offer.user.last_name
    @user_email = offer.user.email
    @inventory_owner_email = "inventorycars@admin.in"
    @offer_price = offer.offer
    @inventory = offer.inventory
    mail(to: @inventory_owner_email, subject: "Offer Accepted for Inventory Item - Action Required") do |format|
    format.html{ render 'offer_accepted_admin'}
    end
  end

  def offer_accepted(offer)
	  @offer_id = offer.id
    @first_name = offer.user.first_name
    @last_name = offer.user.last_name
    @email = offer.user.email
    @offer_price = offer.offer
    @inventory_model_name = offer.inventory.model
    mail(to: @email, subject: "Congratulations! Your Offer on #{@inventory_model_name } Has Been Accepted!**")
  end

  def offer_rejected(offer)
	  @offer_id = offer.id
    @first_name = offer.user.first_name
    @last_name = offer.user.last_name
    @email = offer.user.email
    @inventory_model_name = offer.inventory.model
    mail(to: @email, subject: "Thanks for Your Offer on #{@inventory_model_name } ")
  end

  def offer_requote(offer)
    @offer_id = offer.id
    @first_name = offer.user.first_name
    @last_name = offer.user.last_name
    @email = offer.user.email
    @seller_first_name = offer.seller_user.first_name
    @seller_last_name = offer.seller_user.last_name
    @seller_email = offer.seller_user.email
    @offer_price = offer.offer
    @inventory_model_name = offer.inventory.model

    mail(to: @email, subject: "Exciting Update! Your Inventory Has Been Requoted with a New Offer!") do |format|
      format.html { render 'offer_requote', layout: 'mailer'}
    end
  end

  def offer_requote_admin(offer)
    @offer_id = offer.id
    @first_name = offer.user.first_name
    @last_name = offer.user.last_name
    @email = offer.user.email
    @seller_first_name = offer.seller_user.first_name
    @seller_last_name = offer.seller_user.last_name
    @seller_email = offer.seller_user.email
    @offer_price = offer.offer
    @inventory_model_name = offer.inventory.model
    @inventory = offer.inventory

    mail(to: @email, subject: "Request for Requote: Inventory Item Previously Offered ") do |format|
      format.html { render 'offer_requote_admin', layout: 'mailer'}
    end
  end
end
