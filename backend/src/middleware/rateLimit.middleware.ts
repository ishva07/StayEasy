import rateLimit from "express-rate-limit";
import { createRedisRateLimiter } from "./createRedisRateLimiter.middleware";

export const loginLimiter = createRedisRateLimiter({
  keyPrefix: "login",
  windowSeconds: 15 * 60,
  max: 5,
  message: "Too many attempts, please try again later.",
});

export const refreshLimiter = createRedisRateLimiter({
  keyPrefix: "refresh",
  windowSeconds: 15 * 60,
  max: 20, 
  message: "Too many refresh attempts, please try again later.",
});

export const writeLimiter = createRedisRateLimiter({
  keyPrefix: "write",
  windowSeconds: 15 * 60,
  max: 30,
  keyGenerator: (req) => (req as any).user?.id ?? req.ip ?? "unknown",
  message: "Too many requests, please slow down.",
});

export const globalLimiter = createRedisRateLimiter({
  keyPrefix: "global",
  windowSeconds: 15 * 60,
  max: 200,
  message: "Too many requests from this IP, please try again later.",
});