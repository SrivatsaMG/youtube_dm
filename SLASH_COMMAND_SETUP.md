# Discord Bot Slash Command Setup Guide

## Slash Commands

This bot supports the following slash commands:
- **`/dm`** - Admin-only command to send DMs to specific users
- **`/stop`** - User command to opt-out of YouTube notification DMs
- **`/start`** - User command to opt back in to YouTube notification DMs

## Setup Instructions

### Step 1: Get Your Bot's Client ID

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your bot application
3. Navigate to "OAuth2" in the left sidebar
4. Copy the **CLIENT ID** (you'll need this for the `.env` file)

### Step 2: Get Your Guild (Server) ID

1. Open Discord and enable Developer Mode:
   - User Settings → Advanced → Enable Developer Mode
2. Right-click on your server name
3. Click "Copy Server ID"

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DISCORD_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_bot_client_id_here
GUILD_ID=your_guild_id_here
ADMIN_ROLE_ID=your_admin_role_id_here
PREFIX=!
CHECK_INTERVAL=3
LOG_CHANNEL_ID=your_log_channel_id_here

YOUTUBE_CHANNEL_IDS=UCuAXFkgsw1L7xaCfnd5JJOw,UC-lHJZR3Gqxm24_Vd_AJ5Yw
YOUTUBE_CHANNEL_NAMES=Rick Astley,PewDiePie
YOUTUBE_ROLE_IDS=123456789012345678,987654321098765432
```

**Required for Slash Commands:**
- `DISCORD_TOKEN` - Your bot token
- `CLIENT_ID` - Your bot's application/client ID
- `GUILD_ID` - Your Discord server ID (optional - leave empty for global commands)

**Note:** If you leave `GUILD_ID` empty, commands will be registered globally (takes up to 1 hour). For instant registration, use your guild ID.

### Step 4: Register the Slash Command

After setting up your `.env` file, run:

```bash
npm run register
```

You should see:
```
✅ Successfully registered guild (/) commands!
```

### Step 5: Start the Bot

```bash
npm start
```

## Command Details

### `/dm` - Admin Direct Message (Admin Only)

**Syntax:** `/dm user:@username message:Your message here`

**Parameters:**
- **user** (required): Select the user to send a DM to
- **message** (required): The message content to send

**Usage:**
1. Type `/dm` in any channel
2. Select the target user from the dropdown
3. Enter your message
4. Press Enter

**Permission Requirements:**
- Only users with Administrator permission can use this command
- If `ADMIN_ROLE_ID` is set in `.env`, users with that role can also use the command

**Error Messages:**
- ❌ You do not have permission to use this command.
- ❌ You cannot send DMs to bots.
- ❌ You cannot send a DM to yourself.
- ❌ Cannot send DM to [user]. They may have DMs disabled or have blocked the bot.

---

### `/stop` - Opt-Out of YouTube Notifications (All Users)

**Syntax:** `/stop`

**What it does:**
- Stops you from receiving YouTube notification DMs from this bot
- Your preference is saved permanently until you use `/start`
- You can use this command anywhere (server or DMs)

**Usage:**
1. Type `/stop`
2. Press Enter
3. You'll receive a confirmation message

---

### `/start` - Opt-In to YouTube Notifications (All Users)

**Syntax:** `/start`

**What it does:**
- Resumes YouTube notification DMs if you previously opted out
- You'll start receiving notifications for YouTube uploads again
- You can use this command anywhere (server or DMs)

**Usage:**
1. Type `/start`
2. Press Enter
3. You'll receive a confirmation message

## Troubleshooting

### Commands don't appear in Discord

1. Make sure you ran `npm run register`
2. Check that `CLIENT_ID` and `GUILD_ID` are correct in your `.env` file
3. Ensure your bot has the `applications.commands` scope
4. If using global commands (no GUILD_ID), wait up to 1 hour

### "Missing Access" error

1. Make sure your bot has proper permissions in the server
2. Re-invite the bot with the correct OAuth2 URL including `applications.commands` scope

### Commands registered but not working

1. Check the bot console logs for error messages
2. Verify the bot is online and running
3. Ensure you have the proper permissions to use admin commands

## Additional Features

This bot still supports the original prefix command:

```
!dm <username> <message>
```

Both methods work, but slash commands provide a better user experience with:
- Auto-completion
- Built-in validation
- Better permission handling
- Cleaner interface
