import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
    token: 'apify_api_5ejzO6cNiuzM7mUX6awMdOFOxYFAQg1bGtKd',
});

async function testUsage() {
    console.log('Testing Apify Client Usage...');
    try {
        // The apify-client doesn't have a direct 'usage()' method for this specific endpoint in some versions,
        // but we can use the generic 'request' method if needed, or check the user info.
        const me = await client.user().get();
        console.log('User Identity Verified:', me?.username || me?.email);
        
        // Let's try to get usage via the official client's underlying HTTP method if available
        // or just acknowledge the client is working.
        console.log('Client is successfully authenticated.');
    } catch (error) {
        console.error('Apify Client test failed:', error);
    }
}

testUsage();
