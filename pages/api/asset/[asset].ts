// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getLatestTickersData } from 'utility/binance-coin-trading/pairsManager';
import memoryCache from 'utility/mem-cache/mem-cache';

type Data = {
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    let { asset }: any = req.query;

    const assetsMap = memoryCache.getGlobal('assetsData') || {};

    if (!assetsMap.hasOwnProperty(asset)) {
        res.status(400).json({ error: `Asset ${asset} does not exist!` });
        return;
    }

    try {
        const { data: { code, message, messageDetail, data, success } } = await axios.get("https://www.binance.com/bapi/composite/v1/public/marketing/tardingPair/detail?symbol=" + asset);
        if (data.length === 0) throw 'Cannot fetch data of asset ' + asset;
        // console.log(data[0]);
        res.status(200).json({ assetData: data[0] });
    } catch (err: any) {
        res.status(400).json({
            error: `Some error occured: ${err.message}`
        });
    }
}