const Binance = require('binance-api-node').default

// Authenticated client, can make signed calls
const client = Binance({
    apiKey : '6acfb5k489yKEv3ZqIbBJfbGjXx7h7sBc24PsHRrLZXIjCrwGTdf8j9gzIh2boC5',
    apiSecret : 'NBjqqivq39kdOYzt8RiPM9Dm4UfU8WRsCCigBJ9l97vR5AheYD6XQIrpympGkgok',
    getTime: Date.now() // time generator function, optional, defaults to () => Date.now()
})

client.time().then(time => console.log(time))

async function getCandles(){
    console.log(await client.candles({ symbol: 'ICXUSDT', interval : '15m', limit : '5'}));
    return 
}

getCandles();
