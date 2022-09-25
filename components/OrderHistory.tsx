import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchTransactions } from "../graphql/queries/fetchTransactions";

export default function OrderHistory({ stock }: { stock: string }) {
    const user = useSelector((state: any) => state.user);
    const jwtToken = useSelector((state: any) => state.jwtToken);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const { transactions } = await fetchTransactions("", jwtToken)
                setTransactions(transactions);
            } catch (err) {
                console.log(err);
                setTransactions([]);
            }
        })();
    }, [user]);

    return (
        <div className='order-history-container'>
            <div className="p-5">
                <tr className="py-3 grid grid-cols-[2fr_1fr_1fr_1fr_2fr_2fr_2fr] text-[#5d7795] items-center">
                    <td>Date</td>
                    <td>Pair</td>
                    <td>Type</td>
                    <td>Side</td>
                    <td>Price</td>
                    <td>Quantity</td>
                    <td>Filled</td>
                </tr>
                <div className="h-[300px] overflow-y-scroll">
                    {
                        transactions && transactions.length > 0 ? transactions.map((txs, i) => <>
                            <tr className="grid grid-cols-[2fr_1fr_1fr_1fr_2fr_2fr_2fr] text-[#5d7795] py-1 items-center">
                                <td>{new Date((transactions[transactions.length - 1 - i] as any).created_at).toLocaleString()}</td>
                                <td className="text-[#1E2329]"><Link href={'/stock/' + (transactions[transactions.length - 1 - i] as any).stock_code}><a>{(transactions[transactions.length - 1 - i] as any).stock_code + "/USDT"}</a></Link></td>
                                <td>Market</td>
                                {(transactions[transactions.length - 1 - i] as any).bidask_type == "B"
                                    ?
                                    <td className="text-[#11AD7A]">BUY</td>
                                    : <td className="text-[#E64E62]">SELL</td>
                                }
                                <td>{(transactions[transactions.length - 1 - i] as any).matching_price}</td>
                                <td>{(transactions[transactions.length - 1 - i] as any).quantity}</td>
                                <td>{(transactions[transactions.length - 1 - i] as any).executed_quantity}&ensp;
                                    <span className="text-red-500">
                                        ({Math.floor((transactions[transactions.length - 1 - i] as any).executed_quantity / (transactions[transactions.length - 1 - i] as any).quantity * 10000) / 100}%)
                                    </span>
                                </td>
                            </tr>
                        </>) :
                            <div className="flex flex-row justify-center items-center p-5 h-full w-full">
                                You haven't made any order!
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}