import fetch from 'node-fetch';

const token = 'apify_api_5ejzO6cNiuzM7mUX6awMdOFOxYFAQg1bGtKd';

async function testUsage() {
    console.log('Testing Apify Usage API...');
    try {
        const response = await fetch('https://api.apify.com/v2/users/me/usage/monthly', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const text = await response.text();
            console.error('Error Response:', response.status, text);
            return;
        }

        const json: any = await response.json();
        console.log('Success! Usage Data Summary:');
        console.log('Total Usage (USD):', json.data?.totalUsageCreditsUsdAfterVolumeDiscount);
        console.log('Daily Breakdown Count:', json.data?.dailyServiceUsages?.length);
    } catch (error) {
        console.error('Fetch failed:', error);
    }
}

testUsage();
