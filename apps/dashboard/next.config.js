/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@null-bot/config', '@null-bot/database', '@null-bot/shared', '@null-bot/types'],
  images: {
    domains: ['cdn.discordapp.com'],
  },
};

module.exports = nextConfig;
