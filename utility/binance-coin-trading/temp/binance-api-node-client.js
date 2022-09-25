const Binance = require('binance-api-node').default

// Authenticated client, can make signed calls
const client = Binance({
    apiKey : 'boDDorSjlhobkib2Zldys0BWGfHOHsGxX0J0qHo5IjDa0fFlDuLq28PP3VWjOJXs',
    apiSecret : 'v1dp6mtRayd6clVY0MeoPUZ11VoZJIIcVFx8sCpELuMG90vVDGo6flxHI3wF0xrY',
    getTime: ()=>Date.now() // time generator function, optional, defaults to () => Date.now()
})

module.exports = client;