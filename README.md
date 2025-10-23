# AutoYT DM Bot

A Discord bot that automatically monitors YouTube channels and sends DM notifications to users with specific roles when new videos are uploaded. Features two-way communication between users and admins.

## Features

- **Automatic YouTube Monitoring**: Uses RSS feeds (no YouTube API key required)
- **Smart Notifications**: DMs users with specific roles when new videos are uploaded
- **Duplicate Prevention**: Caches sent videos to avoid re-sending
- **Admin Commands**: Send custom DMs to users with `!dm` command
- **Two-Way Communication**: User DMs are forwarded to a log channel, admins can reply in threads
- **Multi-Channel Support**: Monitor multiple YouTube channels simultaneously
- **Robust Error Handling**: Gracefully handles disabled DMs and network errors

## Setup Instructions

### 1. Discord Bot Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to the "Bot" section and create a bot
4. Enable these **Privileged Gateway Intents**:
   - Server Members Intent
   - Message Content Intent
5. Copy your bot token
6. Invite the bot to your server with these permissions:
   - Send Messages
   - Read Messages/View Channels
   - Manage Threads
   - Embed Links
   - Read Message History

### 2. Configure the Bot

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your `.env` file:
   ```env
   DISCORD_TOKEN=your_bot_token_here
   ADMIN_ROLE_ID=your_admin_role_id
   PREFIX=!
   CHECK_INTERVAL=3
   LOG_CHANNEL_ID=your_log_channel_id
   ```

3. Add your YouTube channels in `.env`:
   ```env
   YOUTUBE_CHANNEL_IDS=UCuAXFkgsw1L7xaCfnd5JJOw,UC-lHJZR3Gqxm24_Vd_AJ5Yw
   YOUTUBE_CHANNEL_NAMES=Rick Astley,PewDiePie
   YOUTUBE_ROLE_IDS=123456789012345678,987654321098765432
   ```
   
   **Important:** All three must have the same number of entries, separated by commas!

### 3. Get Required IDs

**YouTube Channel ID:**
- Visit the YouTube channel
- View page source (Ctrl+U)
- Search for `"channelId"` or `"externalId"`
- OR use: `https://www.youtube.com/@USERNAME` and check the page source

**Discord Role ID:**
1. Enable Developer Mode in Discord (User Settings → Advanced → Developer Mode)
2. Right-click the role → Copy ID

**Log Channel ID:**
1. Right-click the channel you want for DM logs → Copy ID

### 4. Run the Bot

```bash
node index.js
```

## Commands

### Admin Commands

- `!dm <username> <message>` - Send a custom DM to any user (requires admin role)

Example:
```
!dm JohnDoe Welcome to the server!
```

## How It Works

### YouTube Monitoring
- Checks YouTube RSS feeds every X minutes (configurable via `CHECK_INTERVAL`)
- Detects new videos and live streams
- Sends rich embeds with video title, link, thumbnail, and channel name
- Remembers sent videos in `cache.json` to prevent duplicates

### Two-Way Communication
1. **User → Admin**: When a user DMs the bot, the message is forwarded to the log channel in a thread
2. **Admin → User**: Admins reply in the thread, and their messages are automatically sent back to the user
3. **Anonymous Replies**: User sees replies from "Staff" (admin identity is hidden for privacy)

## File Structure

```
├── index.js              # Main bot entry point
├── commandHandler.js     # Handles !dm command
├── dmHandler.js          # Two-way DM communication
├── youtubeMonitor.js     # RSS feed monitoring
├── dmSender.js           # DM notification sender
├── cache.json            # Cached video IDs (auto-managed)
├── .env                  # ALL configuration here
└── .env.example          # Configuration template
```

## Configuration

All configuration is done in the `.env` file:

### YouTube Channels
Add multiple channels using comma-separated values:
```env
YOUTUBE_CHANNEL_IDS=channel_id_1,channel_id_2,channel_id_3
YOUTUBE_CHANNEL_NAMES=Channel Name 1,Channel Name 2,Channel Name 3
YOUTUBE_ROLE_IDS=role_id_1,role_id_2,role_id_3
```

### Cache
The `cache.json` file is automatically managed and stores the last video ID for each channel to prevent duplicates.

## Troubleshooting

**Bot doesn't send DMs:**
- Check that users have DMs enabled from server members
- Verify the role ID is correct
- Check console logs for error messages

**YouTube monitoring not working:**
- Verify the YouTube channel ID is correct
- Check your internet connection
- RSS feeds update with a delay (usually 15 minutes)

**Two-way DM not working:**
- Ensure `LOG_CHANNEL_ID` is set correctly
- Verify the bot has permissions in the log channel
- Check that Message Content Intent is enabled

## Console Output

The bot provides detailed logging:
- ✅ Successful operations
- ⚠️ Warnings (e.g., DMs disabled)
- ❌ Errors with details
- 📩 DM forwarding events
- 🆕 New video detections

## Support

For issues or questions, check the console logs first as they provide detailed information about what's happening.
