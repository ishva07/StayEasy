import {z} from "zod";
import "dotenv/config";

const envSchema = z.object({
    PORT : z.string().default("5000"),
    DATABASE_URL : z.string(),
    JWT_SECRET: z.string(),
    COOKIE_PARSER: z.string()
})

const env = envSchema.parse(process.env);
export default env;