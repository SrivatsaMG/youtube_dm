const PREFIX = process.env.PREFIX || '!';
const ADMIN_ROLE_ID = process.env.ADMIN_ROLE_ID;

async function handle(client, message) {
    if (!message.content.startsWith(PREFIX)) return;
    
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    
    if (command === 'dm') {
        await handleDmCommand(client, message, args);
    }
}

async function handleDmCommand(client, message, args) {
    if (!ADMIN_ROLE_ID) {
        console.warn('⚠️  ADMIN_ROLE_ID not configured in .env');
        return;
    }
    
    if (!message.member.roles.cache.has(ADMIN_ROLE_ID)) {
        await message.reply('❌ You do not have permission to use this command.');
        console.log(`⚠️  ${message.author.tag} tried to use !dm without admin role`);
        return;
    }
    
    if (args.length < 2) {
        await message.reply('❌ Usage: `!dm <username> <message>`');
        return;
    }
    
    const targetUsername = args[0];
    const dmMessage = args.slice(1).join(' ');
    
    let targetUser = null;
    
    if (message.mentions.users.size > 0) {
        targetUser = message.mentions.users.first();
    } else {
        const members = await message.guild.members.fetch();
        const foundMember = members.find(member => 
            member.user.username.toLowerCase() === targetUsername.toLowerCase() ||
            member.user.tag.toLowerCase() === targetUsername.toLowerCase() ||
            member.displayName.toLowerCase() === targetUsername.toLowerCase()
        );
        
        if (foundMember) {
            targetUser = foundMember.user;
        }
    }
    
    if (!targetUser) {
        await message.reply(`❌ Could not find user: ${targetUsername}`);
        return;
    }
    
    try {
        await targetUser.send(`📬 **Message from ${message.author.tag}:**\n\n${dmMessage}`);
        await message.reply(`✅ DM sent successfully to ${targetUser.tag}`);
        console.log(`📨 Admin ${message.author.tag} sent DM to ${targetUser.tag}`);
    } catch (error) {
        if (error.code === 50007) {
            await message.reply(`❌ Cannot send DM to ${targetUser.tag} (DMs disabled)`);
        } else {
            await message.reply(`❌ Failed to send DM: ${error.message}`);
            console.error(`❌ Error sending admin DM:`, error.message);
        }
    }
}

module.exports = { handle };
