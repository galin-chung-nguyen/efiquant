import type { NextPage } from 'next'
import { Component, JSXElementConstructor, useEffect, useState } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
// import { IgrFinancialChart, IgrFinancialChartModule } from 'igniteui-react-charts';
// import { StocksUtility } from 'utility/stock/StockUtility';
import BinanceClient from 'utility/binance-coin-trading/binance-client';
import { useRouter } from 'next/router';
import NavBar from 'src/app/components/NavBar';
import ListStocksColumn from 'src/main-board/components/ListStocksColumn';
import { StocksUtility } from 'utility/stock/StockUtility';
import TradeOrderForm from 'src/main-board/components/TradeOrderForm';
import StockData from 'src/main-board/components/StockData';
import Toast from 'src/app/components/Toast';
import OrderHistory from 'src/main-board/components/OrderHistory';
import Loading from 'src/app/components/Loading';
import { useDispatch } from 'react-redux';
import { addToastNotification } from 'redux/actions/actions';
import img from 'next/image';
import CryptoAnalysisCodeEditor from 'src/main-board/components/codeEditor';

let Chart: any = function () {
  return (
    <></>
  );
}

export function getServerSideProps(ctx: { params: any; }) {
  const { params } = ctx;
  const { stock } = params;

  return {
    props: {
      stock: stock
    }, // will be passed to the page component as props
  };
}

const StockChart = ({ stock }: { stock: string }) => {
  const [stockCandlesData, setStockCandlesData] = useState([]);
  const [latestTickersData, setLatestTickersData] = useState({});
  const [loadingChart, setLoadingChart] = useState(true);
  const [assetData, setAssetData] = useState({});
  const [stockOrders, setStockOrders] = useState({
    "BUY": [],
    "SELL": []
  });

  const dispatch = useDispatch();

  // const [Chart, setIgrFinancialChart] = useState(<></>);

  useEffect(() => {
    import('igniteui-react-charts').then(({ IgrFinancialChart, IgrFinancialChartModule }) => {

      IgrFinancialChartModule.register();

      Chart = (props: any) => {
        return (<IgrFinancialChart {...props} />)
      };

      setStockCandlesData(latestData => {
        setLoadingChart(false);
        return [...latestData]
      });
    });

    fetch('/api/latestTickers').then(result => result.json()).then(({ latestTickersData: data }) => {
      setLatestTickersData(data)
    });

    (async () => {

      try {
        const result = await Promise.all([fetch('/api/asset/' + stock).then(result => result.json()),
        fetch('/api/pair-candles/' + stock + 'USDT').then(result => result.json())
        ]).catch(err => {
          console.log(err);
          throw "Internal error! " + err.message;
        });

        if (result[0].hasOwnProperty("error")) throw result[0].error;
        else if (result[1].hasOwnProperty("error")) throw result[1].error;

        let [{ assetData }, { candlesData }] = result;

        setAssetData(assetData);

        candlesData = candlesData.map((candle: any) => {
          return {
            open: Number(candle.open),
            close: Number(candle.close),
            low: Number(candle.low),
            high: Number(candle.high),
            date: new Date(candle.openTime),
            volume: Number(candle.quoteVolume)
          }
        });

        setStockCandlesData(candlesData);
        console.log('Set data now ',);
      } catch (err: any) {
        console.log(err);
        dispatch(addToastNotification({ message: err.message, type: "failed" }));
      }

    })();
  }, [stock]);

  useEffect(() => {
    console.log(assetData);
  }, [assetData]);

  return (
    <div className='bg-[rgb(250,250,250)]'>
      <NavBar />
      <div className="mx-auto pt-[78px] w-full 2xl:container">
        <div className='assetInfo flex flex-row items-center justify-center p-2 border-[#f0f0f0] border-b-2 bg-[#fafafa]'>
          <div className="symbol-name-container flex flex-row items-center px-5">
            <div className="pr-3">
              {latestTickersData && Object.keys(latestTickersData).length > 0 && <img src={(latestTickersData as any)[stock + "USDT"]?.logo} className="w-16 h-16 rounded-full" />}
            </div>
            <div className='flex flex-col justify-center'>
              <span className='font-bold text-xl'>
                {stock} / USDT
              </span>
              <span className='text-[#707a8a] italic'>
                {latestTickersData && Object.keys(latestTickersData).length > 0 && (latestTickersData as any)[stock + "USDT"].assetName}
              </span>
            </div>
          </div>
          <div className="symbol-price-container text-xl px-5">
            ${latestTickersData && Object.keys(latestTickersData).length > 0 &&
              <span className={(latestTickersData as any)[stock + "USDT"].priceChange >= 0 ? "text-[#11AD7A]" : "text-[#E64E62]"}>
                {Math.round((latestTickersData as any)[stock + "USDT"].curDayClose * 100000) / 100000}
              </span>
            }
          </div>
          <div className="symbol-price-change-container flex flex-col items-center justify-center px-5">
            {latestTickersData && Object.keys(latestTickersData).length > 0 && <>
              <span className={(latestTickersData as any)[stock + "USDT"].priceChange > 0 ? "text-[#11AD7A]" : "text-[#E64E62]"}>
                {(latestTickersData as any)[stock + "USDT"].priceChange >= 0 ? "+" : ""} {(latestTickersData as any)[stock + "USDT"].priceChangePercent}%
              </span>
              <span className='text-[#707a8a] text-sm'>
                ${(latestTickersData as any)[stock + "USDT"].priceChange >= 0 ? "+" : ""} {(latestTickersData as any)[stock + "USDT"].priceChange}
              </span>
            </>}
          </div>
          <div className="symbol-24h-high-container flex flex-col items-left justify-center px-5">
            {stockCandlesData &&
              <>
                <span>
                  24h High
                </span>
                <span className='text-[#707a8a] text-sm'>
                  ${Math.max(...stockCandlesData.slice(-24).map((candle: any) => candle.high))}
                </span>
              </>}
          </div>
          <div className="symbol-24h-low-container flex flex-col items-left justify-center">
            {stockCandlesData &&
              <>
                <span>
                  24h Low
                </span>
                <span className='text-[#707a8a] text-sm'>
                  ${Math.min(...stockCandlesData.slice(-24).map((candle: any) => candle.low))}
                </span>
              </>}
          </div>
          <div className="symbol-24h-volume-container flex flex-col items-left justify-center px-5">
            {stockCandlesData &&
              <>
                <span>
                  24h Volume
                </span>
                <span className='text-[#707a8a] text-sm'>
                  ${StocksUtility.toShortString(stockCandlesData.slice(-24).map((candle: any) => candle.volume | 0).reduce((a, b) => a + b, 0))}
                </span>
              </>}
          </div>
        </div>
        <div className='grid grid-cols-[minmax(300px,1fr)_4fr_minmax(300px,1fr)] grid-flow-row gap—y-3 grid—flow—row—dense w-full'>
          <ListStocksColumn latestTickersData={latestTickersData ? latestTickersData : {}} />
          <div className='stock-trading-column border-[#f0f0f0] border-b-2'>
            <div className='h-[600px] flex justify-center items-center'>
              {loadingChart ? <Loading /> :
                <Chart width="100%"
                  height="600px"
                  chartType="Candle"
                  zoomSliderType="Candle"
                  volumeType="Area"
                  // overlayBrushes="Blue"
                  // overlayOutlines="Blue"
                  // overlayThickness={10}
                  isVerticalZoomEnabled="true"
                  isWindowSyncedToVisibleRange="true"
                  negativeBrushes="#CF304A"
                  indicatorBrushes="Purple"
                  negativeOutlines="#CF304A"
                  positiveBrushes="Blue"
                  volumeBrushes="#0666ebb0"
                  volumeOutlines="#0666ebb0"

                  // rangeSelectorOptions = {[0, 1, 2, 3, 4, 5]}

                  dataSource={stockCandlesData} />
              }
            </div>
            <TradeOrderForm stock={stock} latestTickersData={latestTickersData} />
          </div>
          <StockData stock={stock} latestTickersData={latestTickersData} assetData={assetData} stockOrders={stockOrders} />
        </div>
        {/* <OrderHistory stock={stock} /> */}
        <CryptoAnalysisCodeEditor />
      </div>
      <Toast />
    </div >
  );
}

export default StockChart;