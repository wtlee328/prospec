
import { ApifyClient } from 'apify-client';

export const apifyClient = new ApifyClient({
    token: process.env.APIFY_API_TOKEN,
});

export async function getApifyUsage() {
    const token = process.env.APIFY_API_TOKEN;
    if (!token) throw new Error('APIFY_API_TOKEN is not set');

    const response = await fetch(`https://api.apify.com/v2/users/me/usage/monthly`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        next: { 
            revalidate: 60,
            tags: ['apify-usage']
        } // Cache for 1 minute, but allow tagged revalidation
    });

    if (!response.ok) {
        const text = await response.text();
        console.error('Apify usage fetch failed:', response.status, text);
        throw new Error('Failed to fetch Apify usage');
    }

    const json = await response.json();
    const usageData = json.data || {};

    // Get limits from /users/me as well for more reliable info
    const meResponse = await fetch(`https://api.apify.com/v2/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
        next: { 
            revalidate: 60,
            tags: ['apify-usage']
        }
    });
    
    let limitUsd = 0;
    if (meResponse.ok) {
        const meJson = await meResponse.json();
        // Check both limits (if exists) and plan credits
        limitUsd = meJson.data?.limits?.monthlyUsageUsd || 
                   meJson.data?.plan?.monthlyUsageCreditsUsd || 
                   meJson.data?.plan?.maxMonthlyUsageUsd || 0;
    }

    // Normalize field names
    return {
        usageTotalUsd: usageData.usageTotalUsd ?? (usageData.usageTotalUSD ?? 0),
        limitUsd: limitUsd || (usageData.limitUsd ?? (usageData.limitUSD ?? 0)),
        ...usageData
    };
}
