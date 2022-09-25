'use strict'

const fs = require('fs')

export async function getSavedTickers(){
    return new Promise(resolve=>{
        fs.readFile('pairs.json', (err, data) => {
            if (err) throw err
            let pairslist = JSON.parse(data)
            //console.log(pairslist)
            resolve(pairslist)
        })
    })
}
export async function writeNewTickers(tickersList){
    return new Promise(resolve=>{
        let data = JSON.stringify(tickersList,null,2) // space = 2
        fs.writeFile('pairs.json', data, (err) => {
            if (err) throw err
            console.log('Data written to file')
            resolve()
        })
    })
}

export async function updateTickers(){
    //let data = await getSavedTickers(), tickers = await BinanceClient.allBookTickers(),
    let data = {}, tickers = await BinanceClient.allBookTickers(), currencyList = ['USDT','ETH','BTC','BNB']

    console.log(tickers);
    for(let i in currencyList){
        if(!(currencyList[i] in data)){
            data[currencyList[i]] = []
        }
    }

    for(let x in tickers){
        for(let i in currencyList){
            let currency = currencyList[i]
            if(x.length <= currency.length) continue
            let tail = x.substr(-currency.length)
            if(tail != currency) continue
            let head = x.substr(0,x.length - currency.length)
            data[currency].push(head) // x = head + tail
        }
    }

    for(let currency in data){
        data[currency].sort()
        console.log(currency,' ~> ', data[currency]);
    }

    // await writeNewTickers(data)

    return data;
}