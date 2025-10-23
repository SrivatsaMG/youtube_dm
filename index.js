const { Client, GatewayIntentBits, Partials } = require('discord.js');
const dotenv = require('dotenv');
const youtubeMonitor = require('./youtubeMonitor');
const dmHandler = require('./dmHandler');
const commandHandler = require('./commandHandler');
const slashCommandHandler = require('./slashCommandHandler');
const optoutManager = require('./optoutManager');

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel, Partials.Message]
});

client.once('ready', async () => {
    console.log(`✅ Bot is ready! Logged in as ${client.user.tag}`);
    console.log(`📊 Serving ${client.guilds.cache.size} guild(s)`);
    console.log(`⏱️  Check interval: ${process.env.CHECK_INTERVAL || 3} minutes`);
    
    await optoutManager.init();
    
    console.log('🎥 Starting YouTube monitor...\n');
    youtubeMonitor.start(client);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    
    try {
        await slashCommandHandler.handleSlashCommand(interaction);
    } catch (error) {
        console.error('❌ Error handling slash command:', error);
        const reply = { content: '❌ An error occurred while executing this command.', ephemeral: true };
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(reply);
        } else {
            await interaction.reply(reply);
        }
    }
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    if (message.guild) {
        if (message.channel.isThread()) {
            await dmHandler.handleAdminReply(client, message);
        }
        await commandHandler.handle(client, message);
    } else {
        await dmHandler.handleUserDM(client, message);
    }
});

client.on('error', (error) => {
    console.error('❌ Discord client error:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('❌ Unhandled promise rejection:', error);
});

client.login(process.env.DISCORD_TOKEN).catch((error) => {
    console.error('❌ Failed to login:', error.message);
    process.exit(1);
});
