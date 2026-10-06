import { NextResponse } from 'next/server';
import { withAuthGuard } from '@/shared/lib/api-guard';
import {
  DiagnosisRequestSchema,
  type DiagnosisResponse,
} from '@/features/diagnosis/types/diagnosis.types';
import { runDiagnosis } from '@/features/diagnosis/services/diagnosis-service';

export const POST = withAuthGuard(async (req: Request, context) => {
  try {
    const body = await req.json();
    const validationResult = DiagnosisRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json<DiagnosisResponse>(
        {
          success: false,
          data: null,
          error: validationResult.error.issues.map((i) => i.message).join(', '),
        },
        { status: 400 }
      );
    }

    const { vehicleSpec, symptoms } = validationResult.data;
    const diagnosisResult = await runDiagnosis(vehicleSpec, symptoms);

    const { data: record, error: dbError } = await context.supabase
      .from('diagnosis_records')
      .insert({
        user_id: context.userId,
        maker: vehicleSpec.maker,
        model_name: vehicleSpec.modelName,
        model_year: vehicleSpec.modelYear,
        model_code: vehicleSpec.modelCode,
        engine_code: vehicleSpec.engineCode,
        mileage: vehicleSpec.mileage,
        symptoms,
        primary_cause: diagnosisResult.primaryCause,
        cascade_causes: diagnosisResult.cascadeCauses,
      })
      .select('id')
      .single();

    if (dbError) {
      console.error('[Diagnosis DB Insert Error]:', dbError);
      return NextResponse.json<DiagnosisResponse>(
        {
          success: false,
          data: null,
          error: '診断結果のデータベース保存に失敗しました。',
        },
        { status: 500 }
      );
    }

    return NextResponse.json<DiagnosisResponse>(
      {
        success: true,
        recordId: record.id,
        data: diagnosisResult,
        error: null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Diagnosis Run Route Error]:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : '故障診断処理中に予期せぬエラーが発生しました。';

    return NextResponse.json<DiagnosisResponse>(
      {
        success: false,
        data: null,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}, { rateLimitType: 'diagnosis' });
