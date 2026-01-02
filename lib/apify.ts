
import { ApifyClient } from 'apify-client';

export const apifyClient = new ApifyClient({
    token: process.env.APIFY_API_TOKEN,
});

export async function getApifyUsage() {
    const token = process.env.APIFY_API_TOKEN;
    if (!token) {
        console.warn('APIFY_API_TOKEN is not set. Returning zeroed usage data.');
        return {
            usageTotalUsd: 0,
            limitUsd: 0,
            isMissingToken: true
        };
    }

    try {
        // The limits endpoint is the most reliable source for "current usage vs limit"
        const response = await fetch(`https://api.apify.com/v2/users/me/limits`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            next: { 
                revalidate: 60,
                tags: ['apify-usage']
            }
        });

        if (!response.ok) {
            const text = await response.text();
            console.error('Apify limits fetch failed:', response.status, text);
            return { usageTotalUsd: 0, limitUsd: 0, error: true };
        }

        const json = await response.json();
        const data = json.data || {};
        
        // usage data is typically in data.current.monthlyUsageUsd
        const usageTotalUsd = data.current?.monthlyUsageUsd ?? data.current?.monthlyUsageUSD ?? 0;
        
        // limit is in data.limits.monthlyUsageUsd or similar
        let limitUsd = data.limits?.monthlyUsageUsd ?? data.limits?.monthlyUsageUSD ?? 0;

        // Fallback to /users/me if limits doesn't have it (some plans differ)
        if (!limitUsd) {
            const meResponse = await fetch(`https://api.apify.com/v2/users/me`, {
                headers: { 'Authorization': `Bearer ${token}` },
                next: { revalidate: 60, tags: ['apify-usage'] }
            });
            if (meResponse.ok) {
                const meJson = await meResponse.json();
                limitUsd = meJson.data?.limits?.monthlyUsageUsd || 
                           meJson.data?.plan?.monthlyUsageCreditsUsd || 
                           meJson.data?.plan?.maxMonthlyUsageUsd || 0;
            }
        }

        return {
            usageTotalUsd,
            limitUsd: limitUsd || 5, // Default to 5 if everything fails
            ...data
        };
    } catch (e) {
        console.error('Network error fetching Apify usage:', e);
        return { usageTotalUsd: 0, limitUsd: 0, error: true };
    }
}
