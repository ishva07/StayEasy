import {z} from "zod";
import "dotenv/config";

const envSchema = z.object({
    PORT : z.string().default("5000"),
    DATABASE_URL : z.string(),
    JWT_SECRET: z.string(),
    COOKIE_PARSER: z.string(),
    CLOUDINARY_CLOUD_NAME: z.string(),
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
    GEMINI_API_KEY: z.string().min(1),
     EMAIL_USER: z.string().min(1),
    EMAIL_PASS: z.string().min(1),
    EMAIL_FROM: z.string().min(1),
})

const env = envSchema.parse(process.env);
export default env;