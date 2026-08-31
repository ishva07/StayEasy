import redisClient from "../config/redis";

export type AiQuotaReason = "user_daily" | "global_minute" | "global_daily";

export interface AiQuotaResult {
  allowed: boolean;
  reason?: AiQuotaReason;
}

async function incrementFixedWindow(key: string, windowSeconds: number): Promise<number> {
  const count = await redisClient.incr(key);
  if (count === 1) {
    await redisClient.expire(key, windowSeconds);
  }
  return count;
}

const USER_DAILY_MAX = 10;
const GLOBAL_MINUTE_MAX = 10;
const GLOBAL_DAILY_MAX = 900; 

const DAY_SECONDS = 24 * 60 * 60;
const MINUTE_SECONDS = 60;

export async function checkAiSearchQuota(identifier: string): Promise<AiQuotaResult> {
  const userCount = await incrementFixedWindow(`ai_quota:user_daily:${identifier}`, DAY_SECONDS);
  if (userCount > USER_DAILY_MAX) {
    return { allowed: false, reason: "user_daily" };
  }

  const minuteCount = await incrementFixedWindow("ai_quota:global_minute", MINUTE_SECONDS);
  if (minuteCount > GLOBAL_MINUTE_MAX) {
    return { allowed: false, reason: "global_minute" };
  }

  const dailyCount = await incrementFixedWindow("ai_quota:global_daily", DAY_SECONDS);
  if (dailyCount > GLOBAL_DAILY_MAX) {
    return { allowed: false, reason: "global_daily" };
  }

  return { allowed: true };
}