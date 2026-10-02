"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.botIdentity = exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
const path_1 = __importDefault(require("path"));
// Load env variables
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '../../.env') });
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
const envSchema = zod_1.z.object({
    DISCORD_TOKEN: zod_1.z.string().default('placeholder_token'),
    DISCORD_CLIENT_ID: zod_1.z.string().default('placeholder_client_id'),
    DISCORD_CLIENT_SECRET: zod_1.z.string().default('placeholder_client_secret'),
    DISCORD_REDIRECT_URI: zod_1.z.string().default('http://localhost:3000/api/auth/callback/discord'),
    MONGODB_URI: zod_1.z.string().default('mongodb://127.0.0.1:27017/nullbot'),
    DATABASE_NAME: zod_1.z.string().default('nullbot'),
    DASHBOARD_URL: zod_1.z.string().default('http://localhost:3000'),
    PORT: zod_1.z.string().transform((val) => parseInt(val, 10)).default('3000'),
    SESSION_SECRET: zod_1.z.string().default('super_secret_session_key_must_be_long_and_secure'),
    ENCRYPTION_KEY: zod_1.z.string().default('super_secret_encryption_key_32_b'),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    // Customization Identity
    BOT_NAME: zod_1.z.string().default('NULL'),
    BOT_AVATAR_URL: zod_1.z.string().default('https://cdn.discordapp.com/embed/avatars/0.png'),
    DEFAULT_EMBED_COLOR: zod_1.z.string().default('#5865F2'),
    SUPPORT_SERVER_URL: zod_1.z.string().default('https://discord.gg/nullbot'),
    WEBSITE_URL: zod_1.z.string().default('http://localhost:3000'),
});
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
    console.warn('⚠️ Environment validation warning:', parsedEnv.error.format());
}
exports.env = parsedEnv.success ? parsedEnv.data : envSchema.parse({});
exports.botIdentity = {
    name: exports.env.BOT_NAME,
    avatarUrl: exports.env.BOT_AVATAR_URL,
    defaultEmbedColor: exports.env.DEFAULT_EMBED_COLOR,
    supportServerUrl: exports.env.SUPPORT_SERVER_URL,
    websiteUrl: exports.env.WEBSITE_URL,
    footerText: `${exports.env.BOT_NAME} — Production All-in-One Discord System`,
    status: 'online',
    activityName: `/help | ${exports.env.BOT_NAME} Dashboard`,
};
//# sourceMappingURL=index.js.map