import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default('3001'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    SYSLED_API_URL: z.string().url(),
    SYSLED_API_TOKEN: z.string(),
    SYSLED_API_TIMEOUT: z.coerce.number().default(30000),
    ALLOWED_ORIGINS: z.string().default('http://localhost:5173'),
    CACHE_TTL: z.coerce.number().default(30),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
    RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error('❌ Invalid environment variables:', _env.error.format());
    throw new Error('Invalid environment variables');
}

export const env = _env.data;
