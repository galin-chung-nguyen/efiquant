// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getLatestTickersData } from 'utility/binance-coin-trading/pairsManager';
import memoryCache from 'utility/mem-cache/mem-cache';

type Data = {
    latestTickersData: Object
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const result = getLatestTickersData();
    res.status(200).json({ latestTickersData: result });
}