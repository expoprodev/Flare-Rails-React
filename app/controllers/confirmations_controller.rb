# frozen_string_literal: true

class ConfirmationsController < Devise::ConfirmationsController
  def after_confirmation_path_for(_resource_name, _resource)
    "/?" + { initial_signin: true }.to_query
  end
end
