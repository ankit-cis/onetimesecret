# lib/onetime/logic/secrets/conceal_secret.rb

require_relative './base_secret_action'

module Onetime::Logic
  module Secrets
    class ConcealSecret < BaseSecretAction

      def process_secret
        @kind = :share
        @secret_value = params[:secret]
      end

      def raise_concerns
        super
        raise_form_error "You did not provide anything to share" if secret_value.to_s.empty?
      end

    end
  end
end
