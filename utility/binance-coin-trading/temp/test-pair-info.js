const client1 = require('./node-binance-api-client');

(async()=>{
	let pair = 'ETHUSDT'
	console.log(await client1.prices(pair) /*, (error, ticker) => Number(ticker[pair]))*/)
})()


/*
client1.exchangeInfo(function(error, data) {
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
    for(let pair in minimums){
        console.log(pair,' : ',minimums[pair].stepSize)
    }
    //let pair = 'ETHUSDT'
	//console.log(minimums[pair])
});*/