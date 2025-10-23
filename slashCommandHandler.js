const ADMIN_ROLE_ID = process.env.ADMIN_ROLE_ID;
const optoutManager = require('./optoutManager');

async function handleSlashCommand(interaction) {
    if (interaction.commandName === 'dm') {
        await handleDmSlashCommand(interaction);
    } else if (interaction.commandName === 'stop') {
        await handleStopCommand(interaction);
    } else if (interaction.commandName === 'start') {
        await handleStartCommand(interaction);
    }
}

async function handleDmSlashCommand(interaction) {
    if (!interaction.inGuild()) {
        await interaction.reply({
            content: '❌ This command can only be used in a server.',
            ephemeral: true
        });
        return;
    }
    
    if (ADMIN_ROLE_ID && !interaction.member?.roles?.cache?.has(ADMIN_ROLE_ID)) {
        await interaction.reply({
            content: '❌ You do not have permission to use this command.',
            ephemeral: true
        });
        console.log(`⚠️  ${interaction.user.tag} tried to use /dm without admin role`);
        return;
    }
    
    const targetUser = interaction.options.getUser('user');
    const message = interaction.options.getString('message');
    
    if (targetUser.bot) {
        await interaction.reply({
            content: '❌ You cannot send DMs to bots.',
            ephemeral: true
        });
        return;
    }
    
    if (targetUser.id === interaction.user.id) {
        await interaction.reply({
            content: '❌ You cannot send a DM to yourself.',
            ephemeral: true
        });
        return;
    }
    
    await interaction.deferReply({ ephemeral: true });
    
    try {
        await targetUser.send(`📬 **Message from ${interaction.user.tag}:**\n\n${message}`);
        
        await interaction.editReply({
            content: `✅ DM sent successfully to ${targetUser.tag}`
        });
        
        console.log(`📨 Admin ${interaction.user.tag} sent DM to ${targetUser.tag} via slash command`);
    } catch (error) {
        if (error.code === 50007) {
            await interaction.editReply({
                content: `❌ Cannot send DM to ${targetUser.tag}. They may have DMs disabled or have blocked the bot.`
            });
        } else {
            await interaction.editReply({
                content: `❌ Failed to send DM: ${error.message}`
            });
            console.error(`❌ Error sending admin DM via slash command:`, error);
        }
    }
}

async function handleStopCommand(interaction) {
    const userId = interaction.user.id;
    
    if (optoutManager.isOptedOut(userId)) {
        await interaction.reply({
            content: '🔕 You are already opted out of YouTube notification DMs.\n\nYou will not receive any YouTube video notifications from this bot. Use `/start` if you want to receive notifications again.',
            ephemeral: true
        });
        return;
    }
    
    try {
        await optoutManager.optOut(userId);
        
        await interaction.reply({
            content: '✅ You have successfully opted out of YouTube notification DMs.\n\nYou will no longer receive YouTube video notifications from this bot. Use `/start` anytime to resume notifications.',
            ephemeral: true
        });
        
        console.log(`🔕 ${interaction.user.tag} opted out of YouTube notifications`);
    } catch (error) {
        console.error('❌ Error saving opt-out preference:', error);
        await interaction.reply({
            content: '❌ Failed to save your preference. Please try again later.',
            ephemeral: true
        });
    }
}

async function handleStartCommand(interaction) {
    const userId = interaction.user.id;
    
    if (!optoutManager.isOptedOut(userId)) {
        await interaction.reply({
            content: '🔔 You are already receiving YouTube notification DMs.\n\nYou will continue to receive YouTube video notifications from this bot. Use `/stop` if you want to opt out.',
            ephemeral: true
        });
        return;
    }
    
    try {
        await optoutManager.optIn(userId);
        
        await interaction.reply({
            content: '✅ You have successfully opted back in to YouTube notification DMs.\n\nYou will now receive YouTube video notifications from this bot again. Use `/stop` anytime to opt out.',
            ephemeral: true
        });
        
        console.log(`🔔 ${interaction.user.tag} opted back in to YouTube notifications`);
    } catch (error) {
        console.error('❌ Error saving opt-in preference:', error);
        await interaction.reply({
            content: '❌ Failed to save your preference. Please try again later.',
            ephemeral: true
        });
    }
}

module.exports = { handleSlashCommand };
