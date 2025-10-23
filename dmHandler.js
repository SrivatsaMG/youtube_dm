const { EmbedBuilder } = require('discord.js');

const conversationMap = new Map();
const threadToUserMap = new Map();

async function handleUserDM(client, message) {
    const LOG_CHANNEL_ID = process.env.LOG_CHANNEL_ID;
    
    if (!LOG_CHANNEL_ID) {
        console.warn('⚠️  LOG_CHANNEL_ID not configured, DM forwarding disabled');
        return;
    }
    
    const logChannel = await client.channels.fetch(LOG_CHANNEL_ID).catch(() => null);
    
    if (!logChannel) {
        console.error('❌ Could not find log channel:', LOG_CHANNEL_ID);
        return;
    }
    
    const userId = message.author.id;
    const previousThreadId = conversationMap.get(userId);
    
    if (previousThreadId) {
        try {
            const thread = await client.channels.fetch(previousThreadId).catch(() => null);
            
            if (thread && thread.isThread()) {
                await thread.send(`**${message.author.tag}:** ${message.content}`);
                console.log(`💬 User reply forwarded to existing thread from ${message.author.tag}`);
                return;
            }
        } catch (error) {
            console.log('⚠️  Previous thread not found, creating new message');
        }
    }
    
    const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setAuthor({ 
            name: `${message.author.tag} (${message.author.id})`,
            iconURL: message.author.displayAvatarURL()
        })
        .setDescription(message.content)
        .setFooter({ text: 'Reply in this thread to respond to the user' })
        .setTimestamp();
    
    try {
        const logMessage = await logChannel.send({ 
            content: `📩 **New DM from user:**`,
            embeds: [embed] 
        });
        
        const thread = await logMessage.startThread({
            name: `DM: ${message.author.tag}`,
            autoArchiveDuration: 1440
        });
        
        conversationMap.set(userId, thread.id);
        threadToUserMap.set(thread.id, userId);
        
        console.log(`📩 DM forwarded to log channel from ${message.author.tag}`);
        
    } catch (error) {
        console.error('❌ Error forwarding DM to log channel:', error.message);
    }
}

async function handleAdminReply(client, message) {
    if (!message.channel.isThread()) {
        return;
    }
    
    const threadId = message.channel.id;
    const userId = threadToUserMap.get(threadId);
    
    if (!userId) {
        return;
    }
    
    try {
        const user = await client.users.fetch(userId);
        await user.send(`💬 **Reply from Staff:**\n\n${message.content}`);
        console.log(`📤 Anonymous admin reply sent to ${user.tag} from ${message.author.tag}`);
    } catch (error) {
        await message.reply(`❌ Failed to send reply: ${error.message}`);
        console.error('❌ Error sending admin reply:', error.message);
    }
}

module.exports = { handleUserDM, handleAdminReply };
