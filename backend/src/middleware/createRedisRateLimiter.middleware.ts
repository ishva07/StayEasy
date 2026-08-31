import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis";

interface RateLimiterOptions {
  keyPrefix: string;
  windowSeconds: number;
  max: number;
  keyGenerator?: (req: Request) => string;
  message?: string;
}

export function createRedisRateLimiter({
  keyPrefix,
  windowSeconds,
  max,
  keyGenerator = (req) => req.ip ?? "unknown",
  message = "Too many requests, please try again later.",
}: RateLimiterOptions) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const identifier = keyGenerator(req);
    const key = `ratelimit:${keyPrefix}:${identifier}`;

    try {
      const count = await redisClient.incr(key);

      if (count === 1) {
        await redisClient.expire(key, windowSeconds);
      }

      if (count > max) {
        return res.status(429).json({ success: false, message });
      }

      next();
    } catch (err) {
      console.error("Rate limiter Redis error:", err);
      next();
    }
  };
}