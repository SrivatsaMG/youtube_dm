# Quick Setup Guide

Follow these steps to get your AutoYT DM Bot running:

## Step 1: Get Your Discord Bot Token

1. Visit [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" section in the left sidebar
4. Click "Add Bot"
5. **Enable these Privileged Gateway Intents:**
   - ✅ Server Members Intent
   - ✅ Message Content Intent
6. Click "Reset Token" and copy your bot token
7. **Keep this token secret!**

## Step 2: Invite Bot to Your Server

1. In Discord Developer Portal, go to "OAuth2" → "URL Generator"
2. Select these scopes:
   - ✅ bot
3. Select these bot permissions:
   - ✅ Send Messages
   - ✅ Read Messages/View Channels
   - ✅ Manage Threads
   - ✅ Embed Links
   - ✅ Read Message History
4. Copy the generated URL and open it in your browser
5. Select your server and authorize the bot

## Step 3: Get Discord IDs

### Enable Developer Mode:
1. Open Discord Settings
2. Go to "Advanced"
3. Turn on "Developer Mode"

### Get Admin Role ID:
1. Go to Server Settings → Roles
2. Right-click your admin role → Copy ID

### Get Log Channel ID:
1. Right-click the channel where DM logs should go → Copy ID

### Get YouTube Channel ID:
**Method 1:** From YouTube channel URL
- If the URL is `youtube.com/@username`, view the page source (Ctrl+U)
- Search for `"channelId"` or `"externalId"`

**Method 2:** From old-style URLs
- If the URL is `youtube.com/channel/UC...`, the part after `/channel/` is the ID

### Get Role ID for Notifications:
1. Right-click the role that should receive YouTube notifications → Copy ID

## Step 4: Configure the Bot

1. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Fill in your `.env` file with ALL configuration:
   ```env
   DISCORD_TOKEN=your_bot_token_here
   ADMIN_ROLE_ID=your_admin_role_id
   PREFIX=!
   CHECK_INTERVAL=3
   LOG_CHANNEL_ID=your_log_channel_id
   
   YOUTUBE_CHANNEL_IDS=UCuAXFkgsw1L7xaCfnd5JJOw,UC-lHJZR3Gqxm24_Vd_AJ5Yw
   YOUTUBE_CHANNEL_NAMES=Rick Astley,PewDiePie
   YOUTUBE_ROLE_IDS=123456789012345678,987654321098765432
   ```
   
   **Note:** For YouTube channels, use comma-separated values. All three lists must have the same number of entries!

## Step 5: Start the Bot

The bot is already configured to run automatically. Once you add your Discord token to the `.env` file, it will start working!

## Testing

1. **Test YouTube Notifications:**
   - Wait for the check interval (default 3 minutes)
   - When a monitored channel uploads, users with the specified role will receive a DM

2. **Test Admin Command:**
   - In your Discord server, type: `!dm @username Hello!`
   - The user will receive a DM from the bot

3. **Test Two-Way DMs:**
   - DM the bot as a regular user
   - Check your log channel - you'll see a thread created
   - Reply in that thread as an admin
   - The user will receive your reply as a DM

## Troubleshooting

**"An invalid token was provided"**
→ Double-check your `DISCORD_TOKEN` in `.env`

**Users not receiving DMs**
→ Make sure they have DMs enabled from server members

**YouTube monitoring not working**
→ Verify the YouTube channel ID is correct and RSS feeds are available

**Admin replies not forwarding**
→ Ensure you're replying **inside the thread**, not in the main channel

---

Need more details? Check `README.md` for complete documentation.
