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

    if @offer.status == "accepted" && %w[rejected requote].include?(offer_params[:status])
      flash[:notice] = "Offer already accepted!"
      
      case offer_params[:status]
      when 'rejected'
        redirect_to offers_received_inventory_offers_path
      when 'requote'
        redirect_to offers_sent_inventory_offers_path
      end
    elsif @offer.status == "accepted"
      flash[:notice] = "Invalid status for an accepted offer!"
      redirect_to root_path
    else
      update
    end
  end

  def update
    @offer = InventoryOffer.find_by_id(params[:id])
    offer_value = params[:inventory_offer][:offer].to_i
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

  def requote
    @offer = InventoryOffer.find_by_id(params[:offer_id])
    render :new
  end

  def offers_received
    @offers = InventoryOffer.joins(:inventory).where(inventories: { user_id: current_user.id }).order(created_at: :desc).includes(:inventory).paginate(page: params[:page], per_page: 4)
  end


  private

  def offer_params
    params.require(:inventory_offer).permit(:inventory_id, :offer, :status, :rejection_reason)
  end
end
