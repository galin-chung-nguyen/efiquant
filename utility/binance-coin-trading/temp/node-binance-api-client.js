const Binance = require('node-binance-api');
const client = new Binance().options({
    APIKEY : 'boDDorSjlhobkib2Zldys0BWGfHOHsGxX0J0qHo5IjDa0fFlDuLq28PP3VWjOJXs',
    APISECRET : 'v1dp6mtRayd6clVY0MeoPUZ11VoZJIIcVFx8sCpELuMG90vVDGo6flxHI3wF0xrY'
});
client.getInfoOfSymbol = async function(Symbol){
    return new Promise(resolve=>{
        client.exchangeInfo(function(error, data) {
            let minimums = {};
            for ( let obj of data.symbols ) {
                let filters = {status: obj.status};
                for ( let filter of obj.filters ) {
                    if ( filter.filterType == "MIN_NOTIONAL" ) {
                        filters.minNotional = filter.minNotional;
                    } else if ( filter.filterType == "PRICE_FILTER" ) {
                        filters.minPrice = filter.minPrice;
                        filters.maxPrice = filter.maxPrice;
                        filters.tickSize = filter.tickSize;
                    } else if ( filter.filterType == "LOT_SIZE" ) {
                        filters.stepSize = filter.stepSize;
                        filters.minQty = filter.minQty;
                        filters.maxQty = filter.maxQty;
                    }
                }
                //filters.baseAssetPrecision = obj.baseAssetPrecision;
                //filters.quoteAssetPrecision = obj.quoteAssetPrecision;
                filters.orderTypes = obj.orderTypes;
                filters.icebergAllowed = obj.icebergAllowed;
                minimums[obj.symbol] = filters;
            }
            resolve(minimums[Symbol])
        });
    })
}
module.exports = client;