import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Upstash Redis クライアントの初期化（未設定時は null）
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis =
  redisUrl && redisToken
    ? new Redis({ url: redisUrl, token: redisToken })
    : null;

// OCRエンドポイント用リミッター: 1分間に10リクエスト
export const ocrRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      analytics: true,
      prefix: 'ratelimit:ocr',
    })
  : null;

// Gemini診断エンドポイント用リミッター: 1分間に10リクエスト
export const diagnosisRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      analytics: true,
      prefix: 'ratelimit:diagnosis',
    })
  : null;

// 一般API用リミッター: 1分間に30リクエスト
export const defaultRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, '1 m'),
      analytics: true,
      prefix: 'ratelimit:default',
    })
  : null;

export type RateLimitType = 'ocr' | 'diagnosis' | 'default';

export async function checkRateLimit(
  identifier: string,
  type: RateLimitType = 'default'
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  let limiter = defaultRateLimiter;
  if (type === 'ocr') limiter = ocrRateLimiter;
  if (type === 'diagnosis') limiter = diagnosisRateLimiter;

  // Upstash未設定環境（開発初期やテスト環境）では制限をバイパスして安全に動作
  if (!limiter) {
    return { success: true, limit: 100, remaining: 100, reset: 0 };
  }

  const result = await limiter.limit(identifier);
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}
