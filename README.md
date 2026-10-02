# NULL — All-in-One Discord Bot & Web Dashboard

`NULL` is a production-ready, independently designed all-in-one Discord bot and modern Web Dashboard monorepo. It replaces separate moderation, automod, anti-raid, ticket, music, leveling, giveaway, logging, reaction-role, welcome, utility, and server management bots into one cohesive application.

---

## 🏗️ Architecture & Stack

- **Monorepo Structure**: NPM Workspaces
- **Bot Engine**: Node.js, TypeScript, discord.js v14+, `@discordjs/voice`, REST Slash Commands
- **Web Dashboard**: Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide Icons, Discord OAuth2
- **Database**: MongoDB with Mongoose ODMs & high-performance in-memory cache layer
- **Security**: Zod validation, Discord permission bitfield checks, encrypted session cookies, rate limiting, and hierarchy checks

```text
D:\Null Bot
├── apps
│   ├── bot          # Discord Gateway Bot Client & Command Handlers
│   └── dashboard    # Next.js Web Dashboard & OAuth2 API
├── packages
│   ├── config       # Centralized branding & Zod env validation
│   ├── database     # Mongoose models, connection, & cache manager
│   ├── logger       # Winston structured logger
│   ├── shared       # Permissions, embed builders, duration parser
│   └── types        # TypeScript interfaces across monorepo
├── .env.example
├── docker-compose.yml
├── package.json
└── README.md
```

---

## 🚀 Quick Start (Local Setup)

### Prerequisites

- Node.js LTS (v18+)
- MongoDB server (local or Atlas)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your Discord Application credentials:

```env
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/callback/discord
MONGODB_URI=mongodb://127.0.0.1:27017/nullbot
DASHBOARD_URL=http://localhost:3000
PORT=3000
SESSION_SECRET=super_secret_session_key_32_bytes!
```

### 3. Build & Run

```bash
# Build TypeScript monorepo
npm run build

# Start bot and dashboard concurrently
npm run dev

# Register Slash Commands with Discord REST API
npm run deploy-commands
```

---

## 🌐 Wispbyte Hosting Deployment Guide

Wispbyte provides a Node.js container hosting environment. Follow these exact steps to deploy NULL:

### Step 1: Upload Files
Upload the project directory to Wispbyte via SFTP or Git clone into your container.

### Step 2: Set Environment Variables
In the Wispbyte Control Panel under **Configuration / Environment Variables**, add:
- `NODE_ENV=production`
- `DISCORD_TOKEN=...`
- `DISCORD_CLIENT_ID=...`
- `DISCORD_CLIENT_SECRET=...`
- `DISCORD_REDIRECT_URI=https://your-domain.wispbyte.com/api/auth/callback/discord`
- `MONGODB_URI=mongodb+srv://...`
- `PORT=3000` (or the dynamic `$PORT` provided by Wispbyte)
- `SESSION_SECRET=...`

### Step 3: Configure Build & Start Command
In Wispbyte container startup settings:

- **Install Command**: `npm install`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

`npm start` automatically boots `@null-bot/bot` while listening on `process.env.PORT`.

---

## ⚙️ Discord Developer Portal Setup

1. Open [Discord Developer Portal](https://discord.com/developers/applications).
2. Create a **New Application** named `NULL`.
3. Under **Bot**, copy your **Bot Token** and enable Privileged Gateway Intents:
   - **Presence Intent**
   - **Server Members Intent**
   - **Message Content Intent**
4. Under **OAuth2**, set Redirect URI:
   - `http://localhost:3000/api/auth/callback/discord` (or your Wispbyte domain URL).
5. Copy **Client ID** and **Client Secret** to your `.env` file.

---

## 📋 Included Features & Modules

1. **Moderation**: `/ban`, `/unban`, `/kick`, `/timeout`, `/untimeout`, `/warn`, `/warnings`, `/clear`, `/purge`, `/lock`, `/unlock`, `/slowmode`, `/softban`, `/case`, `/cases`, `/history`, `/nick`, `/say`, `/embed`.
2. **AutoModeration**: Bad words, Invites, External links, Spam bursts, Caps, Mentions, Emoji spam.
3. **Anti-Raid / Anti-Nuke**: Member join burst detection, channel/role mass delete detection, audit log incident logger.
4. **Ticket System**: Multi-category ticket panels, staff notes, claim controls, HTML transcript generator.
5. **Music Engine**: Queue player, volume control, loop modes (Off/Track/Queue), shuffle, seek.
6. **Leveling & XP**: Message & voice XP tracking, rank cards, level up notifications, role rewards.
7. **Giveaways**: Persistent giveaways, enter button, secure winner drawing, reroll, cancel.
8. **Reaction Roles**: Dynamic button or select menu role assignment panels.
9. **Welcome / Goodbye**: Custom text & embed greetings with placeholders `{user}`, `{server}`, `{memberCount}`, `{mention}`.
10. **AutoResponder**: Exact, contains, regex triggers with response options.
11. **Event Logging**: Channels configured for Message, Member, Voice, Role, Channel, Server, and Mod logs.
12. **Server Management**: Backups manager, sticky messages, join-to-create temporary voice channels.
13. **Utility & Fun**: `/serverinfo`, `/userinfo`, `/avatar`, `/botinfo`, `/ping`, `/privacy`, `/poll`, `/remind`, 8ball, coinflip, dice, ship.
14. **Web Dashboard**: Modern responsive UI with Discord OAuth2 login, guild permission verification, dark theme, and instant database save.

---

## 📜 License

MIT License — Original production implementation for NULL Bot.
