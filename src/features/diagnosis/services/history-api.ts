import type { PrimaryCause, CascadeCause } from '@/features/diagnosis/types/diagnosis.types';

export interface DiagnosisRecordItem {
  id: string;
  user_id: string;
  maker: string;
  model_name: string;
  model_year: string | null;
  model_code: string | null;
  engine_code: string | null;
  mileage: number | null;
  symptoms: string;
  primary_cause: PrimaryCause;
  cascade_causes: CascadeCause[];
  created_at: string;
}

export async function fetchDiagnosisHistory(): Promise<DiagnosisRecordItem[]> {
  const response = await fetch('/api/diagnosis/history', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('診断履歴の取得に失敗しました。ログイン状態をご確認ください。');
  }

  const data = await response.json();
  return data.records || [];
}
