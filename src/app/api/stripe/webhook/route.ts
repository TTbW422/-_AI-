import { headers } from 'next/headers';
import type Stripe from 'stripe';
import { stripe } from '@/features/subscription/services/stripe-client';
import { createAdminSupabaseClient } from '@/shared/lib/supabase/admin';
import type { SubscriptionStatus } from '@/shared/types/database.types';

export const dynamic = 'force-dynamic';

function mapStripeStatusToSubscriptionStatus(
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

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured.');
    return new Response('Webhook secret is not configured', { status: 500 });
  }

  const headerList = await headers();
  const signature = headerList.get('stripe-signature');

  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[Webhook Signature Verification Failed]: ${message}`);
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  const adminSupabase = createAdminSupabaseClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId || session.client_reference_id;
        const customerId =
          typeof session.customer === 'string'
            ? session.customer
            : session.customer?.id;
        const subscriptionId =
          typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription?.id;

        if (userId) {
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
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const status = mapStripeStatusToSubscriptionStatus(subscription.status);

        await adminSupabase
          .from('profiles')
          .update({
            subscription_status: status,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await adminSupabase
          .from('profiles')
          .update({
            subscription_status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);
        break;
      }

      default:
        // Ignore other events
        break;
    }

    return Response.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('[Webhook Processing Error]:', error);
    return new Response('Webhook handler failed', { status: 500 });
  }
}
