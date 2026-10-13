import Redis from "ioredis";
import { z } from "zod";

const envSchema = z.object({
  REDIS_HOST: z.string().min(1).optional(),
  REDIS_PORT: z.coerce.number().default(6379),
});

const env = envSchema.parse(process.env);

const redisClient = new Redis({
  host: env.REDIS_HOST ?? "127.0.0.1",
  port: env.REDIS_PORT,
  lazyConnect: true,
  enableOfflineQueue: false,
  maxRetriesPerRequest: 1,
  connectTimeout: 1000,
  retryStrategy: () => null,
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export default redisClient;