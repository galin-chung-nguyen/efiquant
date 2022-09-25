'use strict'

const fs = require('fs')

async function getTradingHistory(){
    return new Promise(resolve=>{
        fs.readFile('tradingHistory.json', (err, data) => {
            if (err) throw err
            let his = JSON.parse(data)
            resolve(his)
        })
    })
}
async function writeNewTickers(tickersList){
    return new Promise(resolve=>{
        let data = JSON.stringify(tickersList,null,2) // space = 2
        fs.writeFile('tradingHistory.json', data, (err) => {
            if (err) throw err
            console.log('Data written to file')
            resolve()
        })
    })
}

async function newTradingRecord(currency,tradingRecord){
    let data = await getTradingHistory()
    data[currency].push(tradingRecord)
    await writeNewTickers(data)
}

//updateTickers()

module.exports = {
    getTradingHistory : getTradingHistory,
    newTradingRecord : newTradingRecord
}