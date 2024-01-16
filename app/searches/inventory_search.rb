class InventorySearch < Searchlight::Search

  def base_query
    Inventory.all
  end

  def search_text
    query.where("make ILIKE :text OR model ILIKE :text", text: "%#{text}%")
  end

  def search_sort
    direction = sort == 'most_recent' ? :desc : :asc
    query.order(created_at: direction)
  end

  def search_dealership_state
    query.joins(:user).where(users: { dealership_state: dealership_state })
  end

  def search_limit
    query.limit(limit)
  end

  def search_user_id
    query.where(user_id: user_id)
  end

  def search_exclude_id
    query.where.not(id: exclude_id)
  end

  def search_inventory_state
    state_to_filter = {
      'live' => 'live',
      'paused' => 'finalized',
      'draft' => ['step_1', 'step_2', 'step_3'],
    }
    query.where(state: state_to_filter[inventory_state])
  end

  def search_exclude_user_id
    query.where.not(user_id: exclude_user_id)
  end

  def search_from_year
    query.where("year >= ?", from_year)
  end

  def search_to_year
    query.where("year <= ?", to_year)
  end

  def search_company
    query.where("make = ?", company)
  end

  def search_min_price
    query.where("price >= ?", min_price)
  end

  def search_max_price
    query.where("price <= ?", max_price)
  end

end
