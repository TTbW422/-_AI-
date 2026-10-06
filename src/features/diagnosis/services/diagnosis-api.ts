import type { VehicleSpec } from '@/features/inspection/types/inspection.types';
import type {
  DiagnosisResult,
  DiagnosisResponse,
} from '@/features/diagnosis/types/diagnosis.types';

export async function requestDiagnosis(
  vehicleSpec: VehicleSpec,
  symptoms: string
): Promise<{ recordId?: string; data: DiagnosisResult }> {
  const response = await fetch('/api/diagnosis/run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      vehicleSpec,
      symptoms,
    }),
  });

  const result: DiagnosisResponse = await response.json();

  if (!response.ok || !result.success || !result.data) {
    throw new Error(
      result.error || '故障診断の実行に失敗しました。時間をおいて再試行してください。'
    );
  }

  return {
    recordId: result.recordId,
    data: result.data,
  };
}
