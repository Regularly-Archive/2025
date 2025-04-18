import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const umamiApiUrl = 'https://umami.yuanpei.me/api/websites/445bd2eb-68f9-47fd-b93a-5dfa92be333d/stats';
    const username = process.env.UMAMI_USERNAME;
    const password = process.env.UMAMI_PASSWORD;

    if (!username || !password) {
        return res.status(500).json({ error: 'Missing environment variables for Umami API credentials.' });
    }

    try {
        const response = await fetch(`${umamiApiUrl}?startAt=${Date.now() - 86400000}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data from Umami API');
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}