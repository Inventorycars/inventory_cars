class InventoryOffersController < ApplicationController
  
  layout 'admin'
  def index
    @offers = InventoryOffer.all.paginate(page: params[:page], per_page: 15).order(created_at: :desc).includes(:inventory)
  end

  def new
    @offer = InventoryOffer.new
  end

  def create
    @offer = current_user.inventory_offers.new(offer_params)
    if @offer.save
      flash[:notice] = "Offer sended successfully"
      redirect_to root_path
    else
      flash[:notice] = @offer&.errors&.first&.options[:message]
    redirect_to root_path
    end
  end

  def edit
    @offer = InventoryOffer.find_by_id(params[:id])
    update if offer_params[:status] == "accepted"
  end


  def update
    @offer = InventoryOffer.find_by_id(params[:id])
    if @offer.update(offer_params)
      redirect_to root_path
    else
      flash[:notice] = @offer&.errors&.first&.options[:message]
      redirect_to root_path 
    end
  end

  def destroy
    @offer = InventoryOffer.find_by_id(params[:id])
    if @offer.destroy
      flash[:notice] = "offer deleted successfully"
      respond_to inventory_offers_path
    end
  end

  private

  def offer_params
    params.require(:inventory_offer).permit(:inventory_id, :offer, :status, :rejection_reason)
  end
end
