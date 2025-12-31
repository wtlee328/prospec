const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

async function check() {
    const token = process.env.APIFY_API_TOKEN;
    const url = `https://api.apify.com/v2/users/me/usage/monthly?token=${token}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
}
check();
