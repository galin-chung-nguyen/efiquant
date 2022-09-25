import { useEffect, useState } from "react"
import { AiOutlineStock } from "react-icons/ai"
import Link from 'next/link';
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

export default function StockData({ stock, latestTickersData, assetData, stockOrders = { "BUY": [], "SELL": [] } }: { stock: any, latestTickersData: any, assetData: any, stockOrders: any }) {

    // useEffect(() => {
    //     console.log(stock);
    //     console.log(latestTickersData);
    //     console.log(assetData);
    // }, [stock, latestTickersData, assetData]);

    const [detailsHidden, setDetailsHidden] = useState(true);

    return (
        <div className='stock-data-column border-[#f0f0f0] border-2'>
            <div className='stock-market-info '>
                <div className="text-lg font-semibold p-3 text-[#0666eb]">
                    {stock} Market Information
                </div>
                <div className="h-[392px] overflow-y-scroll">
                    <div className="p-3 cursor-pointer hover:bg-[#f5f5f5]">
                        <div className="text-[#1E2329] font-[600]">
                            Popularity
                        </div>
                        <div className="text-[#5d7795] text-sm">
                            #{(assetData && Object.keys(assetData).length > 0 && assetData?.rank) || 0}
                        </div>
                    </div>
                    <div className="p-3 cursor-pointer hover:bg-[#f5f5f5]">
                        <div className="text-[#1E2329] font-[600]">
                            Market Cap
                        </div>
                        <div className="text-[#5d7795] text-sm">
                            ${(assetData && Object.keys(assetData).length > 0 && assetData.marketCap && Math.trunc(assetData?.marketCap)?.toLocaleString('US')) || 0}
                        </div>
                    </div>
                    <div className="p-3 cursor-pointer hover:bg-[#f5f5f5]">
                        <div className="text-[#1E2329] font-[600]">
                            Total supply
                        </div>
                        <div className="text-[#5d7795] text-sm">
                            {(assetData && Object.keys(assetData).length > 0 && assetData.totalSupply && assetData.totalSupply?.toLocaleString('en-US')) || 0} {stock}
                        </div>
                    </div>
                    <div className="p-3 cursor-pointer hover:bg-[#f5f5f5]">
                        <div className="text-[#1E2329] font-[600]">
                            Circulating supply
                        </div>
                        <div className="text-[#5d7795] text-sm">
                            {(assetData && Object.keys(assetData).length > 0 && assetData.circulatingSupply && assetData.circulatingSupply?.toLocaleString('en-US')) || 0} {stock}
                        </div>
                    </div>
                    <div className="p-3 cursor-pointer hover:bg-[#f5f5f5]" onClick={() => setDetailsHidden(state => !state)}>
                        <div className="text-[#1E2329] flex flex-row items-center place-content-between font-[600]">
                            Details {detailsHidden ? <IoIosArrowDown className="text-[#1E2329]" /> : <IoIosArrowUp className="text-[#1E2329]" />}
                        </div>
                        {/* <div className="text-[#1E2329] text-base text-overflow-[ellipsis-lastline] break-words overflow-hidden h-[calc(1.5rem*3)] */}
                        {/* "> */}
                        <div className="text-[#5d7795] break-words" style={detailsHidden ? {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            lineClamp: 3,
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                        }
                            : {}
                        }>
                            {assetData && assetData.details && assetData.details[1] && assetData.details[1]?.description}
                        </div>
                    </div>
                </div>
            </div>
            <div className='order-book-info'>

                <div className="text-lg font-semibold p-3 pb-0 text-[#0666eb]">
                    Order book
                </div>
                <div className="order-book-table p-3 text-[13px]">
                    <tr className="grid grid-cols-3 text-[#5d7795] py-1 items-center">
                        <td>Price(USDT)</td>
                        <td className="flex flex-row place-content-end">Sum({stock})</td>
                        <td className="flex flex-row place-content-end">Sum(USDT)</td>
                    </tr>
                    <div className="buy-order-container hover:bg-[#f5f5f5] cursor-pointer h-[250px] overflow-y-scroll">
                        {
                            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((order, key) => (
                                <tr key={key} className="grid grid-cols-3 py-1 items-center">
                                    <td className="text-[#e62323]">{latestTickersData && latestTickersData[stock + "USDT"] ? latestTickersData[stock + "USDT"].curDayClose : Math.floor(Math.random() * 100000000) / 1000}</td>
                                    <td className="flex flex-row place-content-end">0.9311631</td>
                                    <td className="flex flex-row place-content-end">1262.23</td>
                                </tr>
                            ))
                        }
                    </div>
                    <tr className="grid grid-cols-3 text-[#5d7795] py-1 items-center">
                        <td>Latest price</td>
                        <td className="flex flex-row place-content-end text-base">
                            ${latestTickersData && Object.keys(latestTickersData).length > 0 &&
                                <span className={latestTickersData[stock + "USDT"].priceChange >= 0 ? "text-[#11AD7A]" : "text-[#E64E62]"}>
                                    {Math.round(latestTickersData[stock + "USDT"].curDayClose * 100000) / 100000}
                                </span>
                            }
                        </td>
                        <td className="flex flex-row place-content-end">
                            {latestTickersData && Object.keys(latestTickersData).length > 0 && <>
                                <span className={latestTickersData[stock + "USDT"].priceChange > 0 ? "text-[#11AD7A]" : "text-[#E64E62]"}>
                                    {latestTickersData[stock + "USDT"].priceChange >= 0 ? "+" : ""} {latestTickersData[stock + "USDT"].priceChangePercent}%
                                </span>
                            </>}
                        </td>
                    </tr>
                    <div className="sell-order-container hover:bg-[#f5f5f5] cursor-pointer h-[250px] overflow-y-scroll">
                        {
                            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((order, key) => (
                                <tr key={key} className="grid grid-cols-3 py-1 items-center">
                                    <td className="text-[#13BF86]">{latestTickersData && latestTickersData[stock + "USDT"] ? latestTickersData[stock + "USDT"].curDayClose : Math.floor(Math.random() * 100000000) / 1000}</td>
                                    <td className="flex flex-row place-content-end">0.9311631</td>
                                    <td className="flex flex-row place-content-end">1262.23</td>
                                </tr>
                            ))
                        }
                    </div>

                </div>
            </div>
        </div>
    )
}