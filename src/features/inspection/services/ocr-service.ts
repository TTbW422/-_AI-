import { GoogleGenAI, Type } from '@google/genai';
import {
  type VehicleSpec,
  VehicleSpecSchema,
} from '@/features/inspection/types/inspection.types';

const SYSTEM_INSTRUCTION = `
あなたは自動車検査証（車検証）の画像から、車両諸元のみを正確に抽出する専門アナリストです。
【重要制約】
氏名、住所、車台番号（VIN）、自動車登録番号（ナンバープレート情報）などの個人情報・特定情報は絶対に抽出しないでください。
抽出対象は以下の諸元情報のみです：
- maker: メーカー名（例: トヨタ, ホンダ, 日産）
- modelName: 通称型式・車種名（例: プリウス, フィット, セレナ）
- modelYear: 初度登録年月（例: 2018-04, 令和2年3月 等）
- modelCode: 型式（例: DAA-ZVW51, 6AA-GR3）
- engineCode: 原動機型式（例: 2ZR-1NM, LEB）
- mileage: 走行距離（数値km。記載がない場合はnull）
不明な項目や記載のない項目はnullとしてください。
`.trim();

export async function extractVehicleSpecFromImage(
  fileBuffer: Buffer,
  mimeType: string
): Promise<VehicleSpec> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables.');
  }

  const ai = new GoogleGenAI({ apiKey });
  const base64Data = fileBuffer.toString('base64');

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
          {
            text: '提示された車検証画像から、個人情報を完全に除外した上で車両諸元データのみを構造化JSONとして抽出してください。',
          },
        ],
      },
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          maker: { type: Type.STRING, description: '自動車メーカー名' },
          modelName: { type: Type.STRING, description: '車種名' },
          modelYear: { type: Type.STRING, nullable: true, description: '初度登録年月' },
          modelCode: { type: Type.STRING, nullable: true, description: '型式' },
          engineCode: { type: Type.STRING, nullable: true, description: '原動機型式' },
          mileage: { type: Type.INTEGER, nullable: true, description: '走行距離 (km)' },
        },
        required: ['maker', 'modelName'],
      },
      temperature: 0.1,
    },
  });

  const responseText = response.text;
  if (!responseText) {
    throw new Error('OCR解析結果を取得できませんでした。画像が鮮明かご確認ください。');
  }

  const parsedJson = JSON.parse(responseText);
  return VehicleSpecSchema.parse(parsedJson);
}
