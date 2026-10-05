import { z } from 'zod';
import { VehicleSpecSchema } from '@/features/inspection/types/inspection.types';

export const PrimaryCauseSchema = z.object({
  component: z.string().min(1, '直接原因の部品名は必須です'),
  probability: z.number().min(0).max(100),
  mechanism: z.string().min(1, '故障メカニズムの理由は必須です'),
});

export const CascadeCauseSchema = z.object({
  component: z.string().min(1, '連鎖部品名は必須です'),
  direction: z.enum(['upstream', 'downstream']),
  riskLevel: z.enum(['high', 'medium', 'low']),
  consequence: z.string().min(1, '放置時の影響シナリオは必須です'),
});

export const EstimatedCostRangeSchema = z.object({
  min: z.number().nonnegative(),
  max: z.number().nonnegative(),
});

export const SafetyLevelEnum = z.enum([
  'safe_to_drive',
  'caution',
  'stop_immediately',
]);

export const DiagnosisResultSchema = z.object({
  primaryCause: PrimaryCauseSchema,
  cascadeCauses: z.array(CascadeCauseSchema).max(4),
  estimatedCostRange: EstimatedCostRangeSchema,
  safetyLevel: SafetyLevelEnum,
  adviceForMechanic: z.string().min(1, '整備士への伝達事項は必須です'),
});

export const DiagnosisRequestSchema = z.object({
  vehicleSpec: VehicleSpecSchema,
  symptoms: z
    .string()
    .min(5, '症状は5文字以上で入力してください')
    .max(1000, '症状は1000文字以内で入力してください'),
});

export type PrimaryCause = z.infer<typeof PrimaryCauseSchema>;
export type CascadeCause = z.infer<typeof CascadeCauseSchema>;
export type SafetyLevel = z.infer<typeof SafetyLevelEnum>;
export type DiagnosisResult = z.infer<typeof DiagnosisResultSchema>;
export type DiagnosisRequest = z.infer<typeof DiagnosisRequestSchema>;

export interface DiagnosisResponse {
  success: boolean;
  recordId?: string;
  data: DiagnosisResult | null;
  error: string | null;
}
