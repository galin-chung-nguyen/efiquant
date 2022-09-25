// const Binance = require('binance-api-node').default
import Binance from "binance-api-node";

// Authenticated client, can make signed calls
const BinanceClient = Binance({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET,
  getTime: () => Date.now(), // time generator function, optional, defaults to () => Date.now()
});

export default BinanceClient;
