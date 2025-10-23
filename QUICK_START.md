# Quick Start Guide - Admin DM Slash Command

Your Discord bot now has the `/dm` slash command for admins to send direct messages to users!

## 🚀 Setup Steps

### 1. Configure Environment Variables

Create a `.env` file with these settings:

```env
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

**New fields for slash commands:**
- `CLIENT_ID` - Your bot's application/client ID (get from Discord Developer Portal)
- `GUILD_ID` - Your server ID (optional, recommended for instant command registration)

### 2. Register Slash Commands

After setting up your `.env` file, run:

```bash
npm run register
```

This will register the `/dm` command with Discord.

### 3. Start the Bot

```bash
npm start
```

## 📝 How to Use

### Admin Command: `/dm`

Send a DM to any user (admins only):

1. Type `/dm` in any channel
2. Select a user from the dropdown
3. Enter your message
4. Press Enter

**Example:**
```
/dm user:@JohnDoe message:Welcome to our server! Let me know if you need help.
```

### User Commands: `/stop` and `/start`

**Opt-out of YouTube notifications:**
```
/stop
```

**Opt back in to YouTube notifications:**
```
/start
```

These commands can be used by anyone and work in both servers and DMs!

### Prefix Command (Still Works!)

You can still use the original prefix command:
```
!dm @JohnDoe Welcome to our server!
```

## ✅ Features

- **User-friendly interface** - Dropdown to select users in `/dm` command
- **Safe and secure** - Only admins can use `/dm` command
- **User control** - Anyone can opt-out with `/stop` or opt-in with `/start`
- **Persistent preferences** - Opt-out choice is saved permanently
- **Error handling** - Handles blocked DMs and other errors gracefully
- **Smart filtering** - Opted-out users won't receive YouTube notifications
- **Ephemeral responses** - Only you see the confirmation messages

## 📚 Additional Documentation

- **SLASH_COMMAND_SETUP.md** - Detailed setup instructions
- **README.md** - Full bot documentation
- **SETUP_GUIDE.md** - General bot setup guide

## 🔧 Troubleshooting

**Commands don't appear:**
- Make sure you ran `npm run register`
- Check your `CLIENT_ID` and `GUILD_ID` in `.env`
- Wait up to 1 hour if using global commands (no GUILD_ID)

**Permission errors:**
- Verify your `ADMIN_ROLE_ID` is correct
- Ensure you have Administrator permission or the admin role

Need more help? Check the detailed documentation files!
