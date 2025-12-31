console.log('Script started');
const { ApifyClient } = require('apify-client');
console.log('Client imported');

async function run() {
    console.log('In run function');
    const client = new ApifyClient({
        token: 'apify_api_5ejzO6cNiuzM7mUX6awMdOFOxYFAQg1bGtKd',
    });

    try {
        const user = await client.user().get();
        console.log('User found:', user.email || user.username);
    } catch (e) {
        console.error('Error:', e.message);
    }
    console.log('Run finished');
}

run();
