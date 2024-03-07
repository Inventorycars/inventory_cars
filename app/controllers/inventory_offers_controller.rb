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

  if ["accepted", "rejected"].include?(@offer.status)
    flash[:notice] = "Offer already #{@offer.status}!"
  end
  if offer_params[:status] == 'requote'
    @offer.status == 'accepted' ? flash[:notice] = "already accepted" : update
  end
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

  def offers_sent
    @offers = current_user.inventory_offers.order(created_at: :desc).includes(:inventory).paginate(page: params[:page], per_page: 4)
  end

  def offers_received
    @offers = InventoryOffer.joins(:inventory).where(inventories: { user_id: current_user.id }).order(created_at: :desc).includes(:inventory).paginate(page: params[:page], per_page: 4)
  end


  private

  def offer_params
    params.require(:inventory_offer).permit(:inventory_id, :offer, :status, :rejection_reason)
  end
end
