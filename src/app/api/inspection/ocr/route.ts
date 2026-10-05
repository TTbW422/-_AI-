import { NextResponse } from 'next/server';
import { withAuthGuard } from '@/shared/lib/api-guard';
import { extractVehicleSpecFromImage } from '@/features/inspection/services/ocr-service';
import type { OcrResponse } from '@/features/inspection/types/inspection.types';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const POST = withAuthGuard(async (req: Request) => {
  try {
    const formData = await req.formData();
    const file = formData.get('image') || formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json<OcrResponse>(
        {
          success: false,
          data: null,
          error: '車検証画像ファイルが選択されていません。',
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json<OcrResponse>(
        {
          success: false,
          data: null,
          error: '対応していないファイル形式です。JPEG, PNG, WebP形式の画像をアップロードしてください。',
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json<OcrResponse>(
        {
          success: false,
          data: null,
          error: 'ファイルサイズが上限（5MB）を超えています。',
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const vehicleSpec = await extractVehicleSpecFromImage(buffer, file.type);

    return NextResponse.json<OcrResponse>({
      success: true,
      data: vehicleSpec,
      error: null,
    });
  } catch (error) {
    console.error('[OCR Route Error]:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : '車検証の読み取り中に予期せぬエラーが発生しました。画像の鮮明さを確認するか、手動入力をお試しください。';

    return NextResponse.json<OcrResponse>(
      {
        success: false,
        data: null,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
});
