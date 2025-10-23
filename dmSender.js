const { EmbedBuilder } = require('discord.js');
const optoutManager = require('./optoutManager');

async function sendVideoNotification(client, video, channelConfig) {
    const guilds = client.guilds.cache;
    let totalSent = 0;
    let totalFailed = 0;
    
    for (const [guildId, guild] of guilds) {
        try {
            await guild.members.fetch();
            
            const membersWithRole = guild.members.cache.filter(member => 
                member.roles.cache.has(channelConfig.roleId) && !member.user.bot
            );
            
            if (membersWithRole.size === 0) {
                continue;
            }
            
            console.log(`   📤 Sending to ${membersWithRole.size} member(s) in ${guild.name}...`);
            
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle(video.title)
                .setURL(video.link)
                .setAuthor({ name: `${video.channelName} uploaded a new video!` })
                .setDescription(`🎥 [Watch Now](${video.link})`)
                .setImage(video.thumbnail)
                .setFooter({ text: 'AutoYT DM Bot • Use /stop to unsubscribe' })
                .setTimestamp();
            
            for (const [memberId, member] of membersWithRole) {
                if (optoutManager.isOptedOut(memberId)) {
                    console.log(`   🔕 Skipping ${member.user.tag} (opted out)`);
                    continue;
                }
                
                try {
                    await member.send({ embeds: [embed] });
                    totalSent++;
                    await new Promise(resolve => setTimeout(resolve, 500));
                } catch (error) {
                    totalFailed++;
                    if (error.code === 50007) {
                        console.log(`   ⚠️  Cannot DM ${member.user.tag} (DMs disabled)`);
                    } else {
                        console.error(`   ❌ Failed to DM ${member.user.tag}:`, error.message);
                    }
                }
            }
        } catch (error) {
            console.error(`   ❌ Error processing guild ${guild.name}:`, error.message);
        }
    }
    
    console.log(`   ✅ Successfully sent: ${totalSent} | Failed: ${totalFailed}`);
}

module.exports = { sendVideoNotification };
