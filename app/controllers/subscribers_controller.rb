SubscribersController < ApplicationController
  before_action :get_registration_id, only: [:register]

  def register
    begin
      subscriber = Subscriber.where(registration_id: @registation_id).first_or_create do |subscriber|
        subscriber.registration_id = @registation_id
      end
      render json: subscriber, status: 200
    rescue
      render json: subscriber.errors.full_messages.to_sentence, status: :unprocessable_entity
    end
  end

  private
      def get_registration_id
        @registation_id = params[:register_id]
      end
end
