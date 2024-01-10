require "test_helper"

class InventoryOffersControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get inventory_offers_create_url
    assert_response :success
  end

  test "should get destroy" do
    get inventory_offers_destroy_url
    assert_response :success
  end
end
