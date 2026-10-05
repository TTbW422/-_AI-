import type {
  OcrResponse,
  VehicleSpec,
} from '@/features/inspection/types/inspection.types';

export async function uploadInspectionImage(file: File): Promise<VehicleSpec> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/inspection/ocr', {
    method: 'POST',
    body: formData,
  });

  const result: OcrResponse = await response.json();

  if (!response.ok || !result.success || !result.data) {
    throw new Error(
      result.error || '車検証の解析に失敗しました。画像の鮮明さを確認してください。'
    );
  }

  return result.data;
}

// 互換用エイリアス
export const uploadVehicleInspection = uploadInspectionImage;
