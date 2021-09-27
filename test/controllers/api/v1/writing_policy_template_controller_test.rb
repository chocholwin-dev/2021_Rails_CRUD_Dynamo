require 'test_helper'

class Api::V1::WritingPolicyTemplateControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_v1_writing_policy_template_index_url
    assert_response :success
  end

end
