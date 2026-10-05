import { NextResponse } from 'next/server';
import { withAuthGuard } from '@/shared/lib/api-guard';
import { createCheckoutSession } from '@/features/subscription/services/subscription-service';
import type { CheckoutSessionResponse } from '@/features/subscription/types/subscription.types';

export const POST = withAuthGuard(async (_req: Request, context) => {
  try {
    const {
      data: { user },
      error: userError,
    } = await context.supabase.auth.getUser();

    if (userError || !user?.email) {
      return NextResponse.json<CheckoutSessionResponse>(
        {
          url: null,
          error: 'ユーザーのメールアドレスが取得できませんでした。',
        },
        { status: 400 }
      );
    }

    const url = await createCheckoutSession(context.userId, user.email);

    return NextResponse.json<CheckoutSessionResponse>(
      {
        url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Stripe Checkout Route Error]:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'チェックアウトセッションの作成に失敗しました。';

    return NextResponse.json<CheckoutSessionResponse>(
      {
        url: null,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
});
