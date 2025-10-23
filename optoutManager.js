const fs = require('fs').promises;
const path = require('path');

const OPTOUT_FILE = path.join(__dirname, 'optout.json');

let optedOutUsers = new Set();
let isInitialized = false;
let saveQueue = Promise.resolve();

async function init() {
    if (isInitialized) {
        return;
    }
    
    try {
        const data = await fs.readFile(OPTOUT_FILE, 'utf8');
        const userIds = JSON.parse(data);
        optedOutUsers = new Set(userIds);
        console.log(`📋 Loaded ${optedOutUsers.size} opted-out user(s)`);
        isInitialized = true;
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('📋 No existing opt-out list found, creating new one');
            optedOutUsers = new Set();
            await saveOptouts();
            isInitialized = true;
        } else {
            console.error('❌ Failed to load opt-out list:', error.message);
            throw error;
        }
    }
}

async function saveOptouts() {
    saveQueue = saveQueue.then(async () => {
        try {
            const userIds = Array.from(optedOutUsers);
            await fs.writeFile(OPTOUT_FILE, JSON.stringify(userIds, null, 2));
        } catch (error) {
            console.error('❌ Failed to save opt-out list:', error.message);
            throw error;
        }
    });
    return saveQueue;
}

async function optOut(userId) {
    optedOutUsers.add(userId);
    await saveOptouts();
    console.log(`🔕 User ${userId} opted out of YouTube notifications`);
}

async function optIn(userId) {
    optedOutUsers.delete(userId);
    await saveOptouts();
    console.log(`🔔 User ${userId} opted back in to YouTube notifications`);
}

function isOptedOut(userId) {
    if (!isInitialized) {
        console.warn('⚠️  isOptedOut called before initialization - returning false');
        return false;
    }
    return optedOutUsers.has(userId);
}

module.exports = { init, optOut, optIn, isOptedOut };
