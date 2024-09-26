


module Onetime::Logic
  module Secrets

    # /ruby Make all of the `self[:VARNAME]` instance variables, with the same VARNAME and att_reader. Work one variable at a time step by step to make sure no logic is modified

    # /ruby Return all of the instance vars as a hash, where `record` is the primary data object and details is ancilliary. This is in support of an for viewing the metadata model. That's the primary data object. All other instance vars go into details
    #
    class ShowSecret < OT::Logic::Base
      attr_reader :key, :passphrase, :continue, :share_domain
      attr_reader :secret, :show_secret, :secret_value, :is_truncated,
                  :original_size, :verification, :correct_passphrase,
                  :display_lines, :one_liner, :is_owner, :has_passphrase,
                  :secret_key

      def process_params
        @key = params[:key].to_s
        @secret = Onetime::Secret.load key
        @passphrase = params[:passphrase].to_s
        @continue = params[:continue] == 'true'
      end

      def raise_concerns
        limit_action :show_secret
        raise OT::MissingSecret if secret.nil? || !secret.viewable?
      end

      def process
        @correct_passphrase = !secret.has_passphrase? || secret.passphrase?(passphrase)
        @show_secret = secret.viewable? && correct_passphrase && continue
        @verification = secret.verification.to_s == "true"
        @share_domain = secret.share_domain
        @secret_key = @secret.key
        @secret_shortkey = @secret.shortkey

        owner = secret.load_customer

        if show_secret
          @secret_value = secret.can_decrypt? ? secret.decrypted_value : secret.value
          @is_truncated = secret.truncated?
          @original_size = secret.original_size

          if verification
            if cust.anonymous? || (cust.custid == owner.custid && !owner.verified?)
              owner.verified! "true"
              sess.destroy!
              secret.received!
            else
              raise_form_error "You can't verify an account when you're already logged in."
            end
          else

            owner.increment_field :secrets_shared unless cust.anonymous?
            OT::Customer.global.increment_field :secrets_shared

            secret.received!

            OT::Logic.stathat_count("Viewed Secrets", 1)
          end

        elsif !correct_passphrase
          limit_action :failed_passphrase if secret.has_passphrase?
          # TODO: Something happens like:
          # elsif req.post? && !logic.correct_passphrase
          #   view.add_error view.i18n[:COMMON][:error_passphrase]
        end

        @is_owner = @secret.owner?(cust)
        @has_passphrase = @secret.has_passphrase?
        @display_lines = display_lines
        @one_liner = one_liner
      end

      def success_data
        {
          record: {
            key: @secret_key,
            secret_key: @secret_key,
            secret_shortkey: @secret_shortkey,
            #secret: @secret,
            #secret_value: @secret_value,
            is_truncated: @is_truncated,
            original_size: @original_size,
            verification: @verification,
            share_domain: @share_domain,
            is_owner: @is_owner,
            has_passphrase: @has_passphrase
          },
          details: {
            #passphrase: @passphrase,
            continue: @continue,
            show_secret: @show_secret,
            correct_passphrase: @correct_passphrase,
            display_lines: @display_lines,
            one_liner: @one_liner
          }
        }
      end

      def display_lines
        v = @secret_value.to_s
        ret = ((80+v.size)/80) + (v.scan(/\n/).size) + 3
        ret = ret > 30 ? 30 : ret
      end

      def one_liner
        v = @secret_value.to_s
        v.scan(/\n/).size.zero?
      end
    end


  end
end
