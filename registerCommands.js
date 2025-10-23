const { REST, Routes, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const commands = [
    {
        name: 'dm',
        description: 'Send a direct message to a user (Admin only)',
        options: [
            {
                name: 'user',
                description: 'The user to send a DM to',
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: 'message',
                description: 'The message to send',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ],
        default_member_permissions: PermissionFlagsBits.Administrator.toString(),
        dm_permission: false
    },
    {
        name: 'stop',
        description: 'Stop receiving YouTube notification DMs from this bot',
        dm_permission: true
    },
    {
        name: 'start',
        description: 'Resume receiving YouTube notification DMs from this bot',
        dm_permission: true
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('🔄 Started refreshing application (/) commands...');

        if (process.env.GUILD_ID) {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: commands }
            );
            console.log('✅ Successfully registered guild (/) commands!');
        } else {
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands }
            );
            console.log('✅ Successfully registered global (/) commands!');
            console.log('⚠️  Note: Global commands may take up to 1 hour to appear.');
        }
    } catch (error) {
        console.error('❌ Error registering commands:', error);
    }
})();
