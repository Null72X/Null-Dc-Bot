import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';

// Load env variables
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  DISCORD_TOKEN: z.string().default('placeholder_token'),
  DISCORD_CLIENT_ID: z.string().default('placeholder_client_id'),
  DISCORD_CLIENT_SECRET: z.string().default('placeholder_client_secret'),
  DISCORD_REDIRECT_URI: z.string().default('http://localhost:3000/api/auth/callback/discord'),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/nullbot'),
  DATABASE_NAME: z.string().default('nullbot'),
  DASHBOARD_URL: z.string().default('http://localhost:3000'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default('3000'),
  SESSION_SECRET: z.string().default('super_secret_session_key_must_be_long_and_secure'),
  ENCRYPTION_KEY: z.string().default('super_secret_encryption_key_32_b'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Customization Identity
  BOT_NAME: z.string().default('NULL'),
  BOT_AVATAR_URL: z.string().default('https://cdn.discordapp.com/embed/avatars/0.png'),
  DEFAULT_EMBED_COLOR: z.string().default('#5865F2'),
  SUPPORT_SERVER_URL: z.string().default('https://discord.gg/nullbot'),
  WEBSITE_URL: z.string().default('http://localhost:3000'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.warn('⚠️ Environment validation warning:', parsedEnv.error.format());
}

export const env = parsedEnv.success ? parsedEnv.data : envSchema.parse({});

export const botIdentity = {
  name: env.BOT_NAME,
  avatarUrl: env.BOT_AVATAR_URL,
  defaultEmbedColor: env.DEFAULT_EMBED_COLOR,
  supportServerUrl: env.SUPPORT_SERVER_URL,
  websiteUrl: env.WEBSITE_URL,
  footerText: `${env.BOT_NAME} — Production All-in-One Discord System`,
  status: 'online' as const,
  activityName: `/help | ${env.BOT_NAME} Dashboard`,
};
