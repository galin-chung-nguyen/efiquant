import { useState } from "react"
import { AiOutlineStock } from "react-icons/ai"
import Link from 'next/link';

function checkMatchSearchKeyword(s: string, keyword: string): boolean{
    if(!s) return false;
    keyword = keyword.toLowerCase().trim();
    s = s.toLowerCase().trim();

    return s.includes(keyword);
}
export default function ListStocksColumn({ latestTickersData = {} }: { latestTickersData?: Object }) {
    const [chosenTab, setChosenTab] = useState("USD");
    const [searchKeyword, setSearchKeyword] = useState("");

    console.log(latestTickersData);

    return (
        <div className="list-stocks-column flex flex-col max-h-[1100px] border-[#f0f0f0] border-2">
            <div className="list-stocks-nav-box border-[#f0f0f0] border-b-2 border-r">
                <div id="market_controller" className="p-2 grid gap-2 grid-cols-[1fr_1fr_1fr_80px] text-[15px] grid-flow-row-dense">
                    {
                        ["USD", "ETF", "CDs", "Real estate"].map(product => (
                            <button key={product} className={` ${chosenTab == product && "border-b-2 border-infinaPrimary"} h-[30px] text-ellipsis hover:bg-[#e6e8ea] hover:text-[#2466eb]`} onClick={() => setChosenTab(product)}>{product}</button>
                        ))
                    }
                </div>
                <div className='search_input_box p-3 pt-1 w-full'>
                    <div className='bg-gray-100 rounded-lg py-2 px-4 flex items-center border-2 border-white focus-within:border-infinaPrimary'>
                        <AiOutlineStock className='text-gray-400 mr-2' />
                        <input type="text" name="search_asset" placeholder='Search asset...' value = {searchKeyword} onChange = {e => setSearchKeyword(e.target.value)} className='bg-gray-100 outline-none text-base flex-1' />
                    </div>
                </div>
            </div>
            <div className="list-stocks-details flex-1 overflow-y-scroll overflow-x-hidden p-2">
                {
                    latestTickersData && Object.keys(latestTickersData).map(symbol =>
                    ((checkMatchSearchKeyword(symbol.slice(0, -4), searchKeyword) || checkMatchSearchKeyword(latestTickersData[symbol].assetName, searchKeyword)) && <Link href={`/stock/${symbol.slice(0, -4)}`} key={symbol}>
                        <a>
                            <div className="symbol_info p-2 grid grid-cols-[3fr_1fr_1fr] text-[15px] grid-flow-row auto-cols-fr hover:bg-[#e6e8ea] hover:text-[#2466eb]">
                                <div className="symbol_name_container">
                                    <div className="flex flex-row items-center">
                                        <img src={latestTickersData[symbol].logo} className='h-4 w-4 rounded-full' />
                                        <span className="pl-1">{symbol.slice(0, -4)}</span>
                                    </div>
                                    <div className="">
                                        <span className="w-full text-ellipsis whitespace-nowrap italic text-sm text-[#666]">{latestTickersData[symbol].assetName}</span>
                                    </div>
                                </div>
                                <div className="symbol_price_container">
                                    <span className={latestTickersData[symbol].priceChange >= 0 ? "text-[#11AD7A]" : "text-[#E64E62]"}>
                                        {Math.round(latestTickersData[symbol].curDayClose * 100000) / 100000}
                                    </span>
                                </div>
                                <div className="symbol_percent_volume_container">
                                    <span className={latestTickersData[symbol].priceChange >= 0 ? "text-[#11AD7A]" : "text-[#E64E62]"}>
                                        {latestTickersData[symbol].priceChangePercent}%
                                    </span>
                                </div>
                            </div>
                        </a>

                        {/* <div className="item" style="flex: 3 1 0px; min-width: 50px; justify-content: flex-end;">
                                <div className="item-price-text item-color-buy">0.003889</div>
                            </div>
                            <div className="item item-change" style="flex: 5 1 0px; min-width: 60px; justify-content: flex-end;">
                                <div className="item-change-text item-color-sell">-3.52%</div>
                            </div> */}
                    </Link>)
                    )
                }
            </div>
        </div>
    )
}