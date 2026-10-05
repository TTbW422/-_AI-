import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey && process.env.NODE_ENV === 'production') {
  console.warn('STRIPE_SECRET_KEY is not set in environment variables.');
}

export const stripe = new Stripe(stripeSecretKey || 'dummy_key_for_build', {
  typescript: true,
});
