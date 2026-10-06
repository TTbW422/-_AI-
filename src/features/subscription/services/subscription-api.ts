import type {
  CheckoutSessionResponse,
  PortalSessionResponse,
} from '@/features/subscription/types/subscription.types';

export async function createCheckoutSession(): Promise<string> {
  const response = await fetch('/api/stripe/checkout', {
    method: 'POST',
  });

  const data: CheckoutSessionResponse = await response.json();

  if (!response.ok || !data.url) {
    throw new Error(
      data.error || 'チェックアウトセッションの作成に失敗しました。'
    );
  }

  return data.url;
}

export async function createPortalSession(): Promise<string> {
  const response = await fetch('/api/stripe/portal', {
    method: 'POST',
  });

  const data: PortalSessionResponse = await response.json();

  if (!response.ok || !data.url) {
    throw new Error(
      data.error || 'カスタマーポータルの作成に失敗しました。'
    );
  }

  return data.url;
}
