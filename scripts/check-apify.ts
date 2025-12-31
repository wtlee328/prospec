import { ApifyClient } from 'apify-client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = new ApifyClient({ token: process.env.APIFY_API_TOKEN });

async function check() {
    try {
        const me = await client.user().get();
        console.log('User Me:', JSON.stringify(me, null, 2));
        
        // Trial fetching usage if possible
        // The client doesn't have a direct 'usage' method in some versions, 
        // we might need to use the axios/fetch directly if it's missing.
    } catch (e) {
        console.error(e);
    }
}
check();
