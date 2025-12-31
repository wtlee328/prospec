import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
    token: 'apify_api_5ejzO6cNiuzM7mUX6awMdOFOxYFAQg1bGtKd',
});

console.log('Fetching usage...');
const response = await fetch('https://api.apify.com/v2/users/me/usage/monthly', {
    headers: { 'Authorization': 'Bearer apify_api_5ejzO6cNiuzM7mUX6awMdOFOxYFAQg1bGtKd' }
});
const json = await response.json();
console.log('Usage Total USD:', json.data.totalUsageCreditsUsdAfterVolumeDiscount);
