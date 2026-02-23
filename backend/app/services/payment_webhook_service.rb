# frozen_string_literal: true

# Placeholder for future Razorpay/Stripe webhook handling.
# Verify signature, update Payment and Order payment_status.
class PaymentWebhookService
  def self.process(payload, signature = nil)
    # When integrating:
    # 1. Verify webhook signature using gateway secret
    # 2. Find Payment by transaction_id from payload
    # 3. Update payment.status and order.payment_status
    # 4. Optionally trigger OrderStatusJob
    { processed: false, message: "Webhook not integrated" }
  end
end
