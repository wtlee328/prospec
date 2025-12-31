const { ApifyClient } = require('apify-client');

async function run() {
    const client = new ApifyClient({
        token: 'apify_api_5ejzO6cNiuzM7mUX6awMdOFOxYFAQg1bGtKd',
    });

    const input = {
        queries: ["Google"],
        jobTitles: ["Project manager"],
        locations: ["California"],
        industries: ["Software"],
        maxItems: 1
    };

    console.log('Starting actor with input:', JSON.stringify(input));
    try {
        const actorRun = await client.actor('IoSHqwTR9YGhzccez').start(input);
        console.log('Run started successfully! ID:', actorRun.id);
    } catch (e) {
        console.error('Actor start failed:', e.message);
        if (e.response) {
            console.error('Response body:', e.response.body);
        }
    }
}

run();
