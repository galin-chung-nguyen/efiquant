'use strict'

import BinanceClient from './binance-client';

// export async function getSavedTickers() {
//     return new Promise(resolve => {
//         fs.readFile(path.join(__dirname, "pairs.json"), (err, data) => {
//             if (err) throw err
//             let pairslist = JSON.parse(data)
//             //console.log(pairslist)
//             resolve(pairslist)
//         })
//     })
// }
// export function writeNewTickers(tickersList) {
//     let data = JSON.stringify(tickersList, null, 2) // space = 2
//     try {
//         fs.writeFileSync(path.join(__dirname, "pairs.json"), data);
//     } catch (err) {
//         console.log(err);
//     }
// }

// export async function updateTickers() {
//     //let data = await getSavedTickers(), tickers = await BinanceClient.allBookTickers(),
//     let data = {},
//         tickers = await BinanceClient.allBookTickers(),
//         // currencyList = ['USDT', 'ETH', 'BTC', 'BNB'];
//         currencyList = ['USDT'];

//     for (let i in currencyList) {
//         data[currencyList[i]] = [];
//     }

//     for (let x in tickers) {
//         for (let i in currencyList) {
//             let currency = currencyList[i]
//             if (x.length <= currency.length) continue
//             let tail = x.substr(-currency.length)
//             if (tail != currency) continue
//             let head = x.substr(0, x.length - currency.length)
//             data[currency].push(head) // x = head + tail
//         }
//     }

//     for (let currency in data) {
//         data[currency].sort()
//         // console.log(currency, ' ~> ', data[currency])
//     }

//     writeNewTickers(data)

//     return data;
// }

import memoryCache from '../mem-cache/mem-cache';
import axios from 'axios';
import * as fs from 'fs';
import * as binanceSymbolsInfo from './binanceSymbolsInfo.json';
import { ColumnSortDescriptionCollection } from 'igniteui-react-grids';

function convertTickersData(tickers: any[]) {
    const result = {};


    // eventType: '24hrTicker',
    // eventTime: 1658669736163,
    // symbol: 'XMRUSDT',
    // priceChange: '4.20000000',
    // priceChangePercent: '2.879',
    // weightedAvg: '147.94615228',
    // prevDayClose: '145.90000000',
    // curDayClose: '150.10000000',
    // closeTradeQuantity: '0.09900000',
    // bestBid: '150.00000000',
    // bestBidQnt: '5.81900000',
    // bestAsk: '150.10000000',
    // bestAskQnt: '36.50700000',
    // open: '145.90000000',
    // high: '153.00000000',
    // low: '143.50000000',
    // volume: '50897.51700000',
    // volumeQuote: '7530091.80080000',
    // openTime: 1658583333477,
    // closeTime: 1658669733477,
    // firstTradeId: 55561686,
    // lastTradeId: 55585732,
    // totalTrades: 24047
    tickers.forEach(ticker => {
        const { eventTime, priceChange, priceChangePercent, curDayClose, ...rest } = ticker;

        if(ticker.symbol.slice(-4) === "USDT")
            result[ticker.symbol] = {
                eventTime, priceChange, priceChangePercent, curDayClose
            };
    });

    return result;
}

function convertListAssetsToMap(assetsList: any[]) {
    const result = {};

    assetsList.forEach((assetInfo: any) => {
        //     id: '577',
        //   assetCode: '1INCH',
        //   assetName: '1inch',
        //   unit: '',
        //   commissionRate: 0,
        //   freeAuditWithdrawAmt: 0,
        //   freeUserChargeAmount: 3304690,
        //   createTime: 1608866688000,
        //   test: 0,
        //   gas: null,
        //   isLegalMoney: false,
        //   reconciliationAmount: 0,
        //   seqNum: '0',
        //   chineseName: '1inch',
        //   cnLink: '',
        //   enLink: '',
        //   logoUrl: 'https://bin.bnbstatic.com/image/admin_mgs_image_upload/20201225/7898209b-dbee-4ba6-8c66-804d001cf4c9.png',
        //   fullLogoUrl: 'https://bin.bnbstatic.com/image/admin_mgs_image_upload/20201225/7898209b-dbee-4ba6-8c66-804d001cf4c9.png',
        //   supportMarket: null,
        //   feeReferenceAsset: null,
        //   feeRate: null,
        //   feeDigit: 8,
        //   assetDigit: 8,
        //   trading: true,
        //   tags: [Array],
        //   plateType: 'MAINWEB',
        //   etf: false,
        //   isLedgerOnly: false,
        //   delisted: false
        const { id, assetCode, assetName, logoUrl, fullLogoUrl } = assetInfo;
        result[assetInfo.assetCode] = { id, assetCode, assetName, logoUrl, fullLogoUrl };
    });

    return result;
}
export function getLatestTickersData() {
    const pairsData = memoryCache.getGlobal('pairsData');
    const lastFetchTime = pairsData ? pairsData.lastFetchTime : new Date(0);
    const latestTickers = pairsData ? pairsData.latestTickers : {};

    // console.log(Object.keys(lastFetchTime).length, ' ', lastFetchTime.toLocaleTimeString());
    return latestTickers;
}

export function listenToPairUpdates() {
    const tickersLogoInfo = {
        ...binanceSymbolsInfo
    };

    const newTickersLogoInfo = {};

    for(let symbol in tickersLogoInfo){
        if(symbol.slice(-4) !== "USDT") delete tickersLogoInfo[symbol];
        else newTickersLogoInfo[symbol.slice(0, -5) + symbol.slice(-4)] = {...tickersLogoInfo[symbol]};
    }

    memoryCache.setGlobal('pairsData', {
        latestTickers: newTickersLogoInfo,
        lastFetchTime: new Date(0)
    });

    BinanceClient.ws.allTickers(async (tickers) => {
        let pairsData = memoryCache.getGlobal('pairsData');
        const curTime = new Date();

        // distance between two fetch must be at least 10 seconds
        if ((curTime.getTime() - pairsData.lastFetchTime.getTime()) / 1000 < 10) return;

        // fetch new list of assets
        const { data: { code, message, messageDetail, data: assetsList, success } } = await axios('https://www.binance.com/bapi/asset/v2/public/asset/asset/get-all-asset');
        const assetsMap = convertListAssetsToMap(assetsList);

        memoryCache.setGlobal('assetsData', assetsMap);

        console.log(`New ticker updates (${Object.keys(pairsData.latestTickers).length}): `, new Date(pairsData.lastFetchTime).toLocaleTimeString(), ' ~> ', curTime.toLocaleTimeString());
        const tickersUpdate = convertTickersData(tickers);

        for(let symbol in tickersUpdate){
            if(!pairsData.latestTickers.hasOwnProperty(symbol)){
                pairsData.latestTickers[symbol] = tickersUpdate[symbol];
            }else{
                pairsData.latestTickers[symbol] = {...pairsData.latestTickers[symbol], ...tickersUpdate[symbol] };
            }
        }

        pairsData.lastFetchTime = curTime;

        memoryCache.setGlobal('pairsData', pairsData);
    });
}