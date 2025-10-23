const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');
const fs = require('fs').promises;
const path = require('path');
const dmSender = require('./dmSender');

const CACHE_FILE = path.join(__dirname, 'cache.json');
const CHECK_INTERVAL = (parseInt(process.env.CHECK_INTERVAL) || 3) * 60 * 1000;

let cache = {};
let channels = [];

async function loadCache() {
    try {
        const data = await fs.readFile(CACHE_FILE, 'utf8');
        cache = JSON.parse(data);
        console.log('📂 Cache loaded successfully');
    } catch (error) {
        console.log('📂 No existing cache found, creating new one');
        cache = {};
        await saveCache();
    }
}

async function saveCache() {
    try {
        await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
    } catch (error) {
        console.error('❌ Failed to save cache:', error.message);
    }
}

function loadChannels() {
    const channelIds = process.env.YOUTUBE_CHANNEL_IDS;
    const channelNames = process.env.YOUTUBE_CHANNEL_NAMES;
    const roleIds = process.env.YOUTUBE_ROLE_IDS;
    
    if (!channelIds || !channelNames || !roleIds) {
        console.log('⚠️  No YouTube channels configured in .env');
        channels = [];
        return;
    }
    
    const channelIdArray = channelIds.split(',').map(s => s.trim());
    const channelNameArray = channelNames.split(',').map(s => s.trim());
    const roleIdArray = roleIds.split(',').map(s => s.trim());
    
    if (channelIdArray.length !== channelNameArray.length || channelIdArray.length !== roleIdArray.length) {
        console.error('❌ Mismatch in YouTube channel configuration. Ensure YOUTUBE_CHANNEL_IDS, YOUTUBE_CHANNEL_NAMES, and YOUTUBE_ROLE_IDS have the same number of entries.');
        channels = [];
        return;
    }
    
    channels = channelIdArray.map((id, index) => ({
        channelId: id,
        channelName: channelNameArray[index],
        roleId: roleIdArray[index]
    }));
    
    console.log(`📺 Loaded ${channels.length} YouTube channel(s) to monitor`);
    channels.forEach(ch => {
        console.log(`   - ${ch.channelName} (Role ID: ${ch.roleId})`);
    });
}

async function fetchLatestVideo(channelId) {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    
    try {
        const response = await axios.get(rssUrl, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });
        
        const parser = new XMLParser();
        const result = parser.parse(response.data);
        
        if (!result.feed || !result.feed.entry) {
            return null;
        }
        
        const entry = Array.isArray(result.feed.entry) 
            ? result.feed.entry[0] 
            : result.feed.entry;
        
        return {
            videoId: entry['yt:videoId'],
            title: entry.title,
            link: entry.link['@_href'] || `https://www.youtube.com/watch?v=${entry['yt:videoId']}`,
            published: entry.published,
            channelName: entry.author.name,
            thumbnail: `https://i.ytimg.com/vi/${entry['yt:videoId']}/maxresdefault.jpg`
        };
    } catch (error) {
        console.error(`❌ Error fetching RSS for channel ${channelId}:`, error.message);
        return null;
    }
}

async function checkChannel(client, channelConfig) {
    const video = await fetchLatestVideo(channelConfig.channelId);
    
    if (!video) {
        return;
    }
    
    const cacheKey = channelConfig.channelId;
    const cachedVideoId = cache[cacheKey];
    
    if (cachedVideoId === video.videoId) {
        return;
    }
    
    console.log(`\n🆕 New video detected from ${video.channelName}!`);
    console.log(`   📹 ${video.title}`);
    console.log(`   🔗 ${video.link}`);
    
    cache[cacheKey] = video.videoId;
    await saveCache();
    
    await dmSender.sendVideoNotification(client, video, channelConfig);
}

async function checkAllChannels(client) {
    if (channels.length === 0) {
        console.log('⚠️  No channels configured to monitor');
        return;
    }
    
    console.log(`\n🔍 Checking ${channels.length} YouTube channel(s)...`);
    
    for (const channelConfig of channels) {
        await checkChannel(client, channelConfig);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

function start(client) {
    loadCache().then(() => {
        loadChannels();
        checkAllChannels(client);
        
        setInterval(() => {
            checkAllChannels(client);
        }, CHECK_INTERVAL);
    });
}

module.exports = { start };
