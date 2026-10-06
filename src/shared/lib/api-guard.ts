import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/shared/lib/supabase/server';
import { checkRateLimit, type RateLimitType } from '@/shared/lib/rate-limit';
import type { SubscriptionStatus } from '@/shared/types/database.types';

export interface AuthenticatedContext {
  userId: string;
  subscriptionStatus: SubscriptionStatus;
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;
}

export type GuardedHandler = (
  req: Request,
  context: AuthenticatedContext
) => Promise<Response>;

interface AuthGuardOptions {
  requiredSubscription?: SubscriptionStatus[];
  rateLimitType?: RateLimitType;
}

export function withAuthGuard(
  handler: GuardedHandler,
  options?: AuthGuardOptions
) {
  return async (req: Request): Promise<Response> => {
    try {
      const supabase = await createServerSupabaseClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return NextResponse.json(
          { error: 'Unauthorized: Authentication required.' },
          { status: 401 }
        );
      }

      // レート制限チェック（ユーザーID単位）
      if (options?.rateLimitType) {
        const rateLimitResult = await checkRateLimit(
          user.id,
          options.rateLimitType
        );
        if (!rateLimitResult.success) {
          return NextResponse.json(
            {
              error: 'Too Many Requests: リクエスト頻度制限を超過しました。しばらく待ってから再試行してください。',
              limit: rateLimitResult.limit,
              remaining: rateLimitResult.remaining,
            },
            {
              status: 429,
              headers: {
                'X-RateLimit-Limit': rateLimitResult.limit.toString(),
                'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                'X-RateLimit-Reset': rateLimitResult.reset.toString(),
              },
            }
          );
        }
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        return NextResponse.json(
          { error: 'Forbidden: User profile not found.' },
          { status: 403 }
        );
      }

      const subscriptionStatus = profile.subscription_status as SubscriptionStatus;

      if (
        options?.requiredSubscription &&
        !options.requiredSubscription.includes(subscriptionStatus)
      ) {
        return NextResponse.json(
          {
            error: 'Forbidden: Active subscription required for this feature.',
            currentStatus: subscriptionStatus,
          },
          { status: 403 }
        );
      }

      return await handler(req, {
        userId: user.id,
        subscriptionStatus,
        supabase,
      });
    } catch (error) {
      console.error('[API Guard Error]:', error);
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  };
}
