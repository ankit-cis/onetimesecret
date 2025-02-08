# tests/unit/ruby/rspec/support/mail_context.rb

RSpec.shared_context "mail_test_context" do
  let(:mail_config) do
    {
      emailer: {
        mode: :smtp,
        from: 'sender@example.com',
        fromname: 'Test Sender',
        host: 'smtp.example.com',
        port: 587,
        user: 'testuser',
        tls: true,
        auth: true
      },
      site: {
        host: 'example.com',
        ssl: true,
        domains_enabled: true
      }
    }
  end

  let(:mail_locales) do
    {
      'en' => {
        email: {
          welcome: {
            subject: 'Welcome to OnetimeSecret',
            body: 'Welcome email body with {{ verify_uri }}',
            footer: 'Email footer text'
          }
        },
        web: {
          COMMON: {
            description: 'Test Description',
            keywords: 'test,keywords'
          }
        }
      },
      'fr' => {
        email: {
          welcome: {
            subject: 'Bienvenue à OnetimeSecret',
            body: 'Corps du message avec {{ verify_uri }}',
            footer: 'Pied de page'
          }
        },
        web: {
          COMMON: {
            description: 'Description Test',
            keywords: 'test,mots-clés'
          }
        }
      }
    }
  end

  let(:mail_customer) do
    instance_double('Customer',
      identifier: 'test@example.com',
      email: 'test@example.com',
      custid: 'test@example.com',
      anonymous?: false,
      verified?: false
    )
  end

  let(:mail_secret) do
    instance_double('Secret',
      identifier: 'secret123',
      key: 'testkey123',
      share_domain: nil,
      ttl: 7200,
      state: 'pending'
    )
  end

  let(:mail_emailer) do
    instance_double('SMTPMailer',
      send_email: { status: 'sent', message_id: 'test123' }
    )
  end

  before do
    allow(OT).to receive(:conf).and_return(mail_config)
    allow(OT).to receive(:locales).and_return(mail_locales)
    allow(OT).to receive(:info)
    allow(OT).to receive(:ld)
    allow(OT).to receive(:le)
    allow(Onetime::EmailReceipt).to receive(:create)
  end
end
