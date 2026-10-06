import { NextResponse } from 'next/server';
import { withAuthGuard } from '@/shared/lib/api-guard';

export const dynamic = 'force-dynamic';

export const GET = withAuthGuard(async (_req: Request, context) => {
  try {
    const { data: records, error: dbError } = await context.supabase
      .from('diagnosis_records')
      .select('*')
      .eq('user_id', context.userId)
      .order('created_at', { ascending: false });

    if (dbError) {
      console.error('[Diagnosis History Error]:', dbError);
      return NextResponse.json(
        { error: '診断履歴の取得に失敗しました。' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      records: records || [],
    });
  } catch (error) {
    console.error('[Diagnosis History Route Error]:', error);
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました。' },
      { status: 500 }
    );
  }
});
