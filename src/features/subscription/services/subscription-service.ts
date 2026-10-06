import type Stripe from 'stripe';
import { stripe } from '@/features/subscription/services/stripe-client';
import { createAdminSupabaseClient } from '@/shared/lib/supabase/admin';
import type { SubscriptionStatus } from '@/shared/types/database.types';

function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

export function mapStripeStatusToSubscriptionStatus(
  status: Stripe.Subscription.Status
): SubscriptionStatus {
  switch (status) {
    case 'active':
    case 'trialing':
      return 'active';
    case 'past_due':
      return 'past_due';
    case 'canceled':
    case 'unpaid':
    case 'incomplete_expired':
      return 'canceled';
    default:
      return 'free';
  }
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
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { userId },
    success_url: `${appUrl}/dashboard?checkout=success`,
    cancel_url: `${appUrl}/pricing?checkout=canceled`,
  });

  if (!session.url) {
    throw new Error('Failed to create Stripe Checkout session URL.');
  }
  return session.url;
}

export async function createPortalSession(customerId: string): Promise<string> {
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

export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  const userId = session.metadata?.userId || session.client_reference_id;
  const customerId =
    typeof session.customer === 'string' ? session.customer : session.customer?.id;
  const subscriptionId =
    typeof session.subscription === 'string'
      ? session.subscription
      : session.subscription?.id;

  if (!userId) return;

  const adminSupabase = createAdminSupabaseClient();
  await adminSupabase
    .from('profiles')
    .update({
      stripe_customer_id: customerId ?? null,
      stripe_subscription_id: subscriptionId ?? null,
      subscription_status: 'active',
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);
}

export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  const status = mapStripeStatusToSubscriptionStatus(subscription.status);
  const adminSupabase = createAdminSupabaseClient();
  await adminSupabase
    .from('profiles')
    .update({
      subscription_status: status,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);
}

export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  const adminSupabase = createAdminSupabaseClient();
  await adminSupabase
    .from('profiles')
    .update({
      subscription_status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);
}
