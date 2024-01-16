require "test_helper"

class DashboardControllerTest < ActionDispatch::IntegrationTest
  test "should get buyer_dashboard" do
    get dashboard_buyer_dashboard_url
    assert_response :success
  end

  test "should get seller_dashboard" do
    get dashboard_seller_dashboard_url
    assert_response :success
  end
end
