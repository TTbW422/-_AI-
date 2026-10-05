import { z } from 'zod';

export const VehicleSpecSchema = z.object({
  maker: z.string().min(1, 'メーカー名は必須です'),
  modelName: z.string().min(1, '車種名は必須です'),
  modelYear: z.string().nullable().optional().default(null),
  modelCode: z.string().nullable().optional().default(null),
  engineCode: z.string().nullable().optional().default(null),
  mileage: z.number().int().nonnegative().nullable().optional().default(null),
});

export type VehicleSpec = z.infer<typeof VehicleSpecSchema>;

export interface OcrResponse {
  success: boolean;
  data: VehicleSpec | null;
  error: string | null;
}
