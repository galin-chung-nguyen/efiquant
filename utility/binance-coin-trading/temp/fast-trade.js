const { futuresPrices } = require('./binance-api-node-client');
const client1 = require('./node-binance-api-client'),
      client2 = require('./binance-api-node-client'),
      tradeHis = require('./tradingHistoryManager'),
      openBrowser = require('open');

//const potentitalCoin = ['LTC','UNFI','VTHO','WING','HARD','ADA','DOT','OGN','SUSHI','UNI','GRT','SKL','ENJ','AXS','BEL','BTC','ETH','HNT','ZNT','RLC','TOMO','BLZ','NEAR','BZRX','RSR','ZEN','ALGO','ALPHA','ICX','MATI','CVC','SWRV','XZC','ROSE','CREAM','YFIUP','ANT','LINKUP','TRB','AKRO','DOCK','GTO']
/*client1.websockets.chart("NANOUSDT", "1m", (symbol, interval, chart) => {
    let tick = client1.last(chart);
    const last = chart[tick].close;
    //console.info(chart);
    // Optionally convert 'chart' object to array:
    // let ohlc = binance.ohlc(chart);
    // console.info(symbol, ohlc);
    console.info(symbol+" last price: "+last)
});*/

async function getCandleIn5m(pair){
    return new Promise(resolve=>{
        client1.candlesticks(pair,"5m",(error,ticks,symbol)=>{
            resolve(ticks[0])
        }, {limit : 1})
    })
}
async function getPotentialOfPair(coin,currency){
    let pair = coin + currency
    return new Promise(resolve=>{
        client1.candlesticks(pair, "15m", (error, ticks, symbol) => {
            //console.info("candlesticks()", ticks);

            let potential = 0, inc = 0, maxH = 0
            for(let i = 0; i < ticks.length; ++i){
                let [time, o, h, l, c, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = ticks[i];
                let x = (c - o)/o + (h - o)/o
                if(c >= 0) inc += (c - o)/o
                potential += x
                maxH = Math.max(maxH,h)
                if(i >= ticks.length - 1){
                    if(c/h > 0.95){
                        console.log('#1 : ',pair)
                        resolve([coin,0])
                        return 
                    }
                }
            }
            //let [time, o, h, l, c, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = await getCandleIn5m(pair)
            //if( (c - o)/o < 0.0025 ) resolve([coin,0])
            if(inc < 0.1){
                console.log('#2 : ',pair)
                resolve([coin,0])
                return 
            }

            resolve([coin,potential])
        }, {limit: 20});
    })
}
let getNumAfterPoint = x =>{ // only applied for minQuantity of Symbol on Binance
    if(Number.isInteger(x)) return 0
    x = x.toString()
    console.log(x)
    res = 0
    while(x.length > 0 && x[x.length - 1] == '0'){
        x = x.slice(0,-1)
    }
    if(x[x.length - 1] == '.') return 0
    while(x.length > 0 && x[x.length - 1] != '.'){
        ++res
        x = x.slice(0,-1)
    }
    return res
}

async function getPriceOfSymbol(pair){
    do{
        let res = await client1.prices(pair)
        if(res.hasOwnProperty(pair)) return res[pair]
    }while(true)
    //client1.prices(pair, (error, ticker) => resolve(Number(ticker[pair])))
}
async function getStepSizeOfSymbol(pair){
    return Number((await client1.getInfoOfSymbol(pair)).minQty)
}

let precise_decimals= (num,decimalsAfterPoint)=>{
    a = num.toString().split('.')
    if(a.length <= 1) return num
    if(decimalsAfterPoint <= 0) return Number(a[0])
    a[1] = a[1].substr(0,decimalsAfterPoint)
    return Number(a[0] + '.' + a[1])
}

let buyOrder = async (symbol,quantity)=>{
    return client2.order({
        symbol: symbol,
        side: 'BUY',
        quantity: quantity,
        type : 'MARKET'
    })
}

let sellOrder = async (symbol,quantity)=>{
    console.log(`trying to sell symbol ${symbol} with quantity = ${quantity}`)
    return client1.marketSell(symbol, quantity)
    /*return client2.order({
        symbol: symbol,
        side: 'SELL',
        quantity: quantity.toString(),
        type : 'MARKET'
    })*/
}

async function standardizeQuantity(symbol,quantity/*price,moneyLimit*/){
    let stepSize = await getStepSizeOfSymbol(symbol)
    //console.log(symbol,' ',price,' ',quantity,' ',stepSize,' ~> ',getNumAfterPoint(stepSize))
    quantity = precise_decimals(quantity, getNumAfterPoint(stepSize)) // Number(quantity.toFixed(getNumAfterPoint(stepSize)))
    return quantity
}
async function FastTrade(coin,currency){
    let pair = `${coin}${currency}`
    let price = await getPriceOfSymbol(pair),quantity = await standardizeQuantity(pair,11/price)
    console.log('Start trading : ',pair,` with price = ${price}, quantity = ${quantity}`)
    console.log(await client1.getInfoOfSymbol(pair))

    try{
        let BuyOrderInfo = await buyOrder(pair,quantity) //client1.marketBuy(pair, quantity)
        price = Number(BuyOrderInfo.fills[0].price); quantity = Number(BuyOrderInfo.fills[0].qty)
        console.log(BuyOrderInfo)
        console.log(`Buy ${quantity} ${coin} at ${price} ${currency}`);

        //openBrowser('https://www.binance.com/en/trade/' + coin + '_' + currency)

        let startTime = Date.now()

        while(true){
            let newPrice = 0
            while(true){
                try{
                    newPrice = await getPriceOfSymbol(pair)
                    break
                }catch(err){
                    console.log('encounter error when trying to get the price of symbol')
                    console.log(err)
                }
            }
            let diff = Math.abs(newPrice - price)/price 
            let currentTime = Date.now()
            console.log(`new price = ${newPrice} / ${price} => ${newPrice/price * 100}% / ${(currentTime - startTime)/60000} min`)
            if(diff > 0.03 || ((currentTime - startTime)/60000 > 30 && (newPrice - price)/price  > 0.005)){
                try{
                    let newQuantity = await standardizeQuantity(pair,quantity * 0.999)
                    let SellOrderInfo = await sellOrder(pair,newQuantity) //client1.marketSell(pair, newQuantity)
                    console.log(SellOrderInfo)
                    newPrice = Number(SellOrderInfo.fills[0].price)
                    diff = (newPrice - price)/price
                    console.log(`Sell ${newQuantity} ${coin} at ${newPrice} ${currency}`)
                    console.log(`Profit/Loss = ${diff * 100 }%`)
                    await tradeHis.newTradingRecord(currency,{
                        symbol : pair,
                        BuyPrice : price,
                        SellPrice : newPrice,
                        BuyTime : (new Date(BuyOrderInfo.transactTime)).toString(),
                        SellTime : (new Date(SellOrderInfo.transactTime)).toString(),
                        orderId : BuyOrderInfo.orderId,
                        quantity : newQuantity + '/' + quantity,
                        diff : (diff * 100) + '%'
                    })
                }catch(err){
                    console.log('new error when selling : ')
                    console.log(err)
                    process.exit(1)
                }
                break
            }
        }
    }catch(err){
        console.log('new error when buying : ');
        console.log(err)
        process.exit(1)
    }
}

let usedCoin = {

};
/*
(async function(){
    const USDTCoinList = (await require('./pairsManager').getSavedTickers())['USDT']
    let promiseList = []
    for(let i = 0; i < USDTCoinList.length; ++i){
        let coin = USDTCoinList[i]
        //if( (coin.length > 3 && coin.substr(-4) == 'DOWN') || (coin.length > 3 && coin.substr(-2) == 'UP')) continue;
        promiseList.push(getPotentialOfPair(coin,'USDT'))
    }
    for(let t = 0; t < 1; ++t){
        let pt = await (async()=>{
            return Promise.all(promiseList).then(pArr=>{ // potential array
                console.log(pArr)
                for(let i = 0; i < pArr.length; ++i)
                for(let j = i + 1; j < pArr.length; ++j)
                    if(pArr[i][1] < pArr[j][1]){
                        [pArr[i],pArr[j]] = [pArr[j],pArr[i]]
                    }
                while(pArr.length > 0 && pArr[pArr.length - 1][1] <= 0) pArr.pop()
                return pArr
            })
        })()

        //console.log(pt)
        for(let i = 0; i < pt.length; ++i)
            if(!(pt[i][0] in usedCoin)){
                await FastTrade(pt[i][0],'USDT')
                usedCoin[pt[i][0]] = true
                break
            }
    }
})()*/

(async()=>{
    let binance = new require('node-binance-api')().options({
        APIKEY : 'boDDorSjlhobkib2Zldys0BWGfHOHsGxX0J0qHo5IjDa0fFlDuLq28PP3VWjOJXs',
        APISECRET : 'v1dp6mtRayd6clVY0MeoPUZ11VoZJIIcVFx8sCpELuMG90vVDGo6flxHI3wF0xrY'
    });
    console.info( await binance.futuresMarketSell( 'ONTUSDT', 17) );
})().then(res=>{
    console.log('ok res = ',res)
})

/*

[Object: null prototype] {
  symbol: 'IRISUSDT',
  orderId: 30130621,
  orderListId: -1,
  clientOrderId: 'MY2xufYCL6gxIHab7Dv3Kd',
  transactTime: 1610816987692,
  price: '0.00000000',
  origQty: '180.00000000',
  executedQty: '180.00000000',
  cummulativeQuoteQty: '10.44900000',
  status: 'FILLED',
  timeInForce: 'GTC',
  type: 'MARKET',
  side: 'SELL',
  fills: [
    [Object: null prototype] {
      price: '0.05805000',
      qty: '180.00000000',
      commission: '0.00018096',
      commissionAsset: 'BNB',
      tradeId: 853396
    }
  ]
}
*/