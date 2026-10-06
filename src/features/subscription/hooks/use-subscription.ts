'use client';

import { useState, useCallback, useEffect } from 'react';
import type { SubscriptionStatus } from '@/shared/types/database.types';
import {
  createCheckoutSession,
  createPortalSession,
} from '@/features/subscription/services/subscription-api';
import { createBrowserSupabaseClient } from '@/shared/lib/supabase/client';

export function useSubscription() {
  const [status, setStatus] = useState<SubscriptionStatus>('free');
  const [hasCustomerId, setHasCustomerId] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSubscription() {
      try {
        const supabase = createBrowserSupabaseClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (isMounted) {
            setStatus('free');
            setHasCustomerId(false);
            setIsFetching(false);
          }
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_status, stripe_customer_id')
          .eq('id', user.id)
          .single();

        if (isMounted) {
          if (profile) {
            setStatus(profile.subscription_status);
            setHasCustomerId(!!profile.stripe_customer_id);
          }
          setIsFetching(false);
        }
      } catch {
        if (isMounted) {
          setStatus('free');
          setHasCustomerId(false);
          setIsFetching(false);
        }
      }
    }

    loadSubscription();

    return () => {
      isMounted = false;
    };
  }, []);

  const startCheckout = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const url = await createCheckoutSession();
      if (typeof window !== 'undefined') {
        window.location.href = url;
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : '決済画面への接続に失敗しました。';
      setError(message);
      setIsLoading(false);
    }
  }, []);

  const openPortal = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const url = await createPortalSession();
      if (typeof window !== 'undefined') {
        window.location.href = url;
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'カスタマーポータルへの接続に失敗しました。';
      setError(message);
      setIsLoading(false);
    }
  }, []);

  return {
    status,
    hasCustomerId,
    isPro: status === 'active',
    isLoading,
    isFetching,
    error,
    startCheckout,
    openPortal,
  };
}
