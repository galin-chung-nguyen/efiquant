// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import BinanceClient from 'utility/binance-coin-trading/binance-client';
import memoryCache from 'utility/mem-cache/mem-cache';

type Data = {
    candlesData: Object[]
} | {
    error: any
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { pair }: { pair: string } = req.query as any;

    if (!pair) {
        res.status(400).json({
            error: "Ticker not found"
        });
        return;
    }
    if (pair.slice(-4) !== "USDT") {
        res.status(400).json({
            error: "Only USDT pairs are allowed"
        });
        return;
    }
    const asset = pair.slice(0, -4);
    const currency = pair.slice(-4);

    const assetsMap = memoryCache.getGlobal('assetsData');

    if (!assetsMap || !assetsMap.hasOwnProperty(asset)) {
        res.status(400).json({
            error: `Asset '${asset}' not found`
        });
        return;
    }

    const tickersMap = memoryCache.getGlobal('pairsData');

    if (!tickersMap || !tickersMap.latestTickers.hasOwnProperty(pair)) {
        res.status(400).json({
            error: `Symbol ${pair} not found`
        });
        return;
    }

    const curTime = new Date();

    const candlesRequestPromise = [];
    for (let i = 0; i < 3; ++i) {
        candlesRequestPromise.push(
            BinanceClient.candles({ symbol: pair, interval: "1h", endTime: curTime.getTime() - i * 3600000000, limit: 1000 })
        );

        // console.log('End time ', new Date(curTime.getTime() - i * 3600000000).toDateString());
    }

    let result: any[] = [];

    try {
        const data = await Promise.all(candlesRequestPromise);

        // console.log(new Date(data[0][0].openTime).toUTCString());
        // console.log(new Date(data[0][0].closeTime).toUTCString());
        // console.log(new Date(data[1][0].openTime).toUTCString());
        // console.log(new Date(data[2][0].openTime).toUTCString());
        result = [...data[2], ...data[1], ...data[0]];
    } catch (err: any) {
        console.log(err);
        res.status(400).json({
            error: `Some error occured: ${err.message}`
        });
        return;
    }

    res.status(200).json({ candlesData: result });
}