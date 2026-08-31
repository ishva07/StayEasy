import Redis from "ioredis";
import { z } from "zod";

const envSchema = z.object({
  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.coerce.number().default(6379),
});

const env = envSchema.parse(process.env);

const redisClient = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export default redisClient;