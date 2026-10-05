import { NextResponse } from 'next/server';
import { withAuthGuard } from '@/shared/lib/api-guard';
import { createPortalSession } from '@/features/subscription/services/subscription-service';
import type { PortalSessionResponse } from '@/features/subscription/types/subscription.types';

export const POST = withAuthGuard(async (_req: Request, context) => {
  try {
    const { data: profile, error: profileError } = await context.supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', context.userId)
      .single();

    if (profileError || !profile?.stripe_customer_id) {
      return NextResponse.json<PortalSessionResponse>(
        {
          url: null,
          error: 'カスタマー情報が見つかりません。先にプランの登録を行ってください。',
        },
        { status: 400 }
      );
    }

    const url = await createPortalSession(profile.stripe_customer_id);

    return NextResponse.json<PortalSessionResponse>(
      {
        url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Stripe Portal Route Error]:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'カスタマーポータルセッションの作成に失敗しました。';

    return NextResponse.json<PortalSessionResponse>(
      {
        url: null,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
});
