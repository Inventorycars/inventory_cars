class DashboardController < ApplicationController

  def index
    @inventories = Inventory.all
    # redirect_to current_dashboard_url
  end

  def buyer_dashboard
    @inventories = [] #InventorySearch.new(exclude_user_id: current_user.id).results # Inventory.where.not(user_id: current_user.id)
  end

  def seller_dashboard
    @inventories = InventorySearch.new(user_id: current_user.id, inventory_state: 'live').results
  end

  def filter_seller_inventories
    @inventories = InventorySearch.new(seller_inventories_filter_params.merge({user_id: current_user.id})).results
    render turbo_stream: turbo_stream.update('inventory_list', partial: 'inventories/inventory_list', locals: { inventories: @inventories })
  end

  def listing_inventory
    inventory = Inventory.find(params[:id])
    inventory.toggle!(:listed)
    redirect_to seller_dashboard_path
  end

  def seller_inventories_filter_params
    params.require(:seller_inventories).permit(:inventory_state)
  end

  def fetch_homenet_inventory
    notice = current_user.update(params.require(:user).permit(:homenet_email)) ? "Inventory upload is in progress" : res.errors.full_messages.join(', ')
    redirect_to seller_dashboard_path, notice: notice
  end

end
