import { stripe } from '@/features/subscription/services/stripe-client';

function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

export async function createCheckoutSession(
  userId: string,
  userEmail: string
): Promise<string> {
  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) {
    throw new Error('STRIPE_PRICE_ID is not configured in environment variables.');
  }

  const appUrl = getAppUrl();

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    client_reference_id: userId,
    customer_email: userEmail,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId,
    },
    success_url: `${appUrl}/dashboard?checkout=success`,
    cancel_url: `${appUrl}/pricing?checkout=canceled`,
  });

  if (!session.url) {
    throw new Error('Failed to create Stripe Checkout session URL.');
  }

  return session.url;
}

export async function createPortalSession(
  customerId: string
): Promise<string> {
  const appUrl = getAppUrl();

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${appUrl}/dashboard`,
  });

  if (!session.url) {
    throw new Error('Failed to create Stripe Customer Portal session URL.');
  }

  return session.url;
}
