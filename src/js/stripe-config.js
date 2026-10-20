/**
 * Stripe Checkout client config (public values only).
 * Never put STRIPE_SECRET_KEY here — secrets belong in Vercel env only.
 */
export const stripeConfig = {
  enabled: false,
  checkoutEndpoint: '/api/create-checkout-session',
  publishableKey: 'pk_test_REPLACE_WITH_YOUR_PUBLISHABLE_KEY',
  depositPercent: 30,
};

export function isStripeCheckoutReady() {
  const endpoint = (stripeConfig.checkoutEndpoint || '').trim();
  if (!stripeConfig.enabled) return false;
  if (!endpoint) return false;
  if (/YOUR_|example\.com|placeholder/i.test(endpoint)) return false;
  return true;
}

export default stripeConfig;
