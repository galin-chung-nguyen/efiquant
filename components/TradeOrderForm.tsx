import { FaGoogle, FaLinkedinIn, FaRegEnvelope, FaFacebookF } from "react-icons/fa";
import Link from 'next/link';
import { FiDollarSign } from "react-icons/fi";
import { MdLockOutline } from "react-icons/md";
import { useEffect, useState } from "react";
import { makeGraphqlMutation, makeGraphqlQuery } from "../apollo-client";
import { RiCopperCoinFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { ApolloError, gql } from "@apollo/client";
import { addToastNotification, setUserInfoAction } from "../redux/actions/actions";
import { fetchUserInfo } from "../graphql/queries/fetchUserInfo";

function checkFloatNumber(x: string) {
    return /[+-]?([0-9]*[.])?[0-9]+/.test(x) && !isNaN(parseFloat(x));
}

function MarketOrderForm({ stock, type, balance, latestTickersData }: { stock: string, type: "BUY" | "SELL", balance: { usdt: Number, stock: Number }, latestTickersData: Object }) {
    const jwtToken = useSelector((state: any) => state.jwtToken);
    const toastNotifications = useSelector((state: any) => state.toastNotifications);
    const dispatch = useDispatch();

    const [orderInfo, setOrderInfo] = useState({
        price: "",
        quantity: "", // stock
        total: "",
        general: ""
    });

    const [errorState, setErrorState] = useState<{ price: string, quantity: string, total: string, general: string }>({
        price: "",
        quantity: "",
        total: "",
        general: ""
    });

    const [orderSlider, setOrderSlider] = useState(0);

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    //// hooks
    useEffect(() => {
        if (latestTickersData && Object.keys(latestTickersData).length > 0 && (latestTickersData as any)[stock + "USDT"].curDayClose) {
            setOrderInfo(prev => ({ ...prev, price: (latestTickersData as any)[stock + "USDT"].curDayClose }));
        }
    }, [latestTickersData]);

    const validateBuyOrderData = () => {
        const newErrorState: { price: string, quantity: string, total: string, general: string } = {
            price: "",
            quantity: "",
            total: "",
            general: ""
        };

        console.log(orderInfo);

        newErrorState.price = ((price): string => {
            if (!price) return "* Price is required!"
            if (!checkFloatNumber(price) || Number(price) <= 0) return "* Price must be a positive number!";
            return "";
        })(orderInfo.price);

        newErrorState.quantity = ((quantity): string => {
            if (!quantity) return "* Stock quantity is required!"
            if (!checkFloatNumber(quantity) || Number(quantity) <= 0) return "* Stock quantity must be a positive number!";
            if (Number(quantity) < 1) return "* Stock quantity must be at least 1!";
            if (Number(quantity) > 99) return "* Stock quantity must be at most 99!";
            // if (type === "SELL" && Number(quantity) > balance.stock) return "* Your stock balance is not enough!";
            return "";
        })(orderInfo.quantity);

        newErrorState.total = ((total): string => {
            if (!total) return "* Total quantity is required!"
            if (!checkFloatNumber(total) || Number(total) <= 0) return "* Total quantity must be a positive number!";
            // if (type === "BUY" && Number(total) > balance.usdt) return "* Your usdt balance is not enough!";
            return "";
        })(orderInfo.total);

        setErrorState(newErrorState)

        let validationSucceeded: boolean = true;
        Object.keys(newErrorState).forEach(field => {
            if ((newErrorState as any)[field]) validationSucceeded = false;
        });

        return validationSucceeded;
    }

    const handleSubmit = async (e: any) => {
        setSubmitButtonDisabled(true);
        e.preventDefault();

        // invalid sign up data
        if (!validateBuyOrderData()) {
            setSubmitButtonDisabled(false);
            return;
        }

        try {
            if (jwtToken !== localStorage.getItem('jwtToken')) {
                throw new Error("Seems like you have logged out from the current acount! Please refresh the page!");
            }
            const { data: { newMarketOrder } } = await makeGraphqlMutation(gql`
            mutation newMarketOrder($input: OrderInput!) {
                newMarketOrder(order: $input){
                    id        
                    user_id            
                    price           
                    quantity      
                    stock_code     
                    bidask_type     
                    market        
                    matching_type      
                    currency          
                    total_amount_placed 
                    settle_date         
                    validity_date       
                    mortgate_sell      
                    force_sell          
                    short_sell          
                    origin              
                    channel             
                    trading_partner   
                    status             
                    created_at          
                    commission          
                    executed_quantity 
                    matching_price     
                    matching_time      
                    t2_at        
                }
            }
        `, {
                "input": {
                    "bidask_type": type === "BUY" ? "B" : "S",
                    "stock_code": stock,
                    "price": Number(orderInfo.price),
                    "quantity": Number(orderInfo.quantity) // Number(orderInfo.quantity)
                }
            }, {
                headers: {
                    "authorization": jwtToken ? "Bearer " + jwtToken : ""
                }
            });

            dispatch(addToastNotification({ message: `New ${type} order of ${newMarketOrder.quantity} ${stock} at price ${newMarketOrder.matching_price} USDT has been created at ${new Date(newMarketOrder.created_at).toLocaleString()}!`, type: "success" }))

            setErrorState({
                price: "",
                quantity: "",
                total: "",
                general: ""
            });

            setOrderInfo(prev => ({
                price: prev.price,
                quantity: "",
                total: "",
                general: ""
            }));

            setOrderSlider(0);
        } catch (err: any) {

            const newErrorState = {
                price: "",
                quantity: "",
                total: "",
                general: ""
            };

            console.log(err);

            if (err.message.toLowerCase().includes("price")) newErrorState.price = "* " + err.message;
            else if (err.message.toLowerCase().includes("quantity")) newErrorState.quantity = "* " + err.message;
            else if (err.message.toLowerCase().includes("total")) newErrorState.total = "* " + err.message;
            else if (err.message === "stock_code must match /^([A-Z]+)$/ regular expression") {
                dispatch(addToastNotification({ message: "Stock code must contains 3-5 uppercase alphabet characters!", type: "failed" }))
            } else if (err.message.toLowerCase().includes("authentication") || err.message.toLowerCase().includes("authorization")) {
                dispatch(addToastNotification({ message: "Please sign in first!", type: "failed" }))
            } else {
                dispatch(addToastNotification({ message: err.message, type: "failed" }))
            }

            setErrorState(newErrorState);
        }
        setSubmitButtonDisabled(false);
        try {
            const { user } = await fetchUserInfo(jwtToken)
            dispatch(setUserInfoAction(user));
        } catch (err) {
            console.log(err);
        }

    }

    // input handler
    const updateAmount = (e: any) => {
        const newAmount = e.target.value;
        if (newAmount === "") {
            setOrderInfo({ ...orderInfo, "quantity": "", total: "" });
            return;
        }
        if (checkFloatNumber(newAmount) && Number(newAmount) >= 0) {
            setOrderInfo(prev => ({
                ...orderInfo, "quantity": newAmount, "total": prev.price ? (Number(prev.price) * Number(newAmount)).toString() : prev.total
            }));
        }
    }
    const updateTotal = (e: any) => {
        const newTotal = e.target.value;
        if (newTotal === "") {
            setOrderInfo({ ...orderInfo, "quantity": "", "total": "" });
            return;
        }
        if (checkFloatNumber(newTotal) && Number(newTotal) >= 0) {
            setOrderInfo(prev => ({
                ...orderInfo, "total": newTotal, "quantity": prev.price ? (Number(newTotal) / Number(prev.price)).toString() : prev.quantity
            }));
        }
    }
    return (
        <form className='flex flex-col items-center flex-1'>
            <div className="text-m text-[14px] flex flex-item justify-between py-2 w-full">
                <span key={1} className="text-[#707a8a]" ><>Available</></span>
                <span className="text-[rgb(30,35,41)]"><>{type == "SELL" ? Number(balance.stock).toLocaleString() + " " + stock : Number(balance.usdt).toLocaleString() + " USDT"}</></span>
            </div>
            <div className='price_input_box mb-3 w-full text-base'>
                <div className={`bg-gray-100 rounded-lg w-full py-2 px-4 flex items-center
                border-2 border-white focus-within:border-infinaPrimary ` + (errorState.price ? "border-red-200 focus-within:border-red-600" : "")}>
                    <FiDollarSign className='text-gray-400 mr-2' />
                    <div className="pr-5 text-[#848e9c] text-sm  min-w-[60px]">Price</div>
                    <input type="text" name="price" value={orderInfo.price} className='bg-gray-100 outline-none italic text-[#6e747e] flex-1' />
                    <div className="text-right pl-2 text-[#848e9c] text-sm min-w-[50px]">USDT</div>
                </div>
                <div className='text-red-500 text-left px-3 pt-1 text-sm'>{errorState.price}</div>
            </div>
            <div className='amount_input_box mb-3 w-full text-base'>
                <div className={`bg-gray-100 rounded-lg w-full py-2 px-4 flex items-center
                border-2 border-white focus-within:border-infinaPrimary ` + (errorState.quantity ? "border-red-200 focus-within:border-red-600" : "")}>
                    <RiCopperCoinFill className='text-gray-400 mr-2' />
                    <div className="pr-2 text-[#848e9c] text-sm min-w-[60px]">Quantity</div>
                    <input type="text" name="price" value={orderInfo.quantity} onChange={updateAmount} className='bg-gray-100 outline-none flex-1' disabled={submitButtonDisabled} />
                    <div className="text-right pl-2 text-[#848e9c] text-sm min-w-[50px]">{stock}</div>
                </div>
                <div className='text-red-500 text-left px-3 pt-1 text-sm'>{errorState.quantity}</div>
            </div>
            <div className="w-full mb-3">
                <input type="range" list="tickmarks" value={orderSlider} className='w-full' onChange={e => {
                    setOrderSlider(Number(e.target.value));
                    setOrderInfo((prev) => {
                        const newAmount = (Number(e.target.value) / 100 * Number(balance.stock));
                        const newTotal = (Number(e.target.value) / 100 * Number(balance.usdt));

                        return {
                            price: prev.price,
                            quantity: type == "BUY" ? (
                                prev.price ? (newTotal / Number(prev.price)).toString() : prev.quantity
                            ) : newAmount.toString(),
                            total: type === "BUY" ?
                                (newTotal.toString()) :
                                (prev.price ? (Number(prev.price) * newAmount).toString() : prev.total),
                            general: ""
                        }
                    });
                }} min="0" max="100" disabled={submitButtonDisabled} />
                <datalist id="tickmarks">
                    <option value="0"></option>
                    <option value="25"></option>
                    <option value="50"></option>
                    <option value="75"></option>
                    <option value="100"></option>
                </datalist>
            </div>
            <div className='total_input_box mb-3 w-full text-base'>
                <div className={`bg-gray-100 rounded-lg w-full py-2 px-4 flex items-center
                border-2 border-white focus-within:border-infinaPrimary ` + (errorState.total ? "border-red-200 focus-within:border-red-600" : "")}>
                    <FiDollarSign className='text-gray-400 mr-2' />
                    <div className="pr-2 text-[#848e9c] text-sm min-w-[60px]">Total</div>
                    <input type="text" name="price" value={orderInfo.total} onChange={updateTotal} className='bg-gray-100 outline-none flex-1' disabled={submitButtonDisabled} />
                    <div className="text-right pl-2 text-[#848e9c] text-sm min-w-[50px]">USDT</div>
                </div>
                <div className='text-red-500 text-left px-3 pt-1 text-sm'>{errorState.total}</div>
                <div className='text-red-500 text-left px-3 pt-1 text-sm'>{errorState.general}</div>
            </div>
            {type == "BUY" ?
                <button className="rounded-md px-5 py-3 w-full inline-block font-semibold bg-[#0ecb81] text-white" disabled={submitButtonDisabled} onClick={handleSubmit}>Buy {stock}</button>
                :
                <button className="rounded-md px-5 py-3 w-full inline-block font-semibold bg-[#f6465d] text-white" disabled={submitButtonDisabled} onClick={handleSubmit}>Sell {stock}</button>
            }
        </form>
    )
}
export default function TradeOrderForm({ stock, latestTickersData }: { stock: string, latestTickersData: Object }) {
    const user = useSelector((state: any) => state.user);

    const [balance, setBalance] = useState({
        usdt: 0,
        stock: 0
    });

    useEffect(() => {
        setBalance(prev => {

            let stockAmountHolding = 0;
            if (user && user.portfolio) {
                const stockPortfolio = user.portfolio.find((holding: any) => holding.code === stock);
                if (stockPortfolio) stockAmountHolding = Number(stockPortfolio.quantity);
            }

            return {
                usdt: user && user.balance ? user.balance : 0,
                stock: stockAmountHolding
            }
        });
    }, [user, stock]);

    return (
        <div className='pt-5 pb-10 max-w-full'>
            <div className="flex flex-row justify-center items-center pb-5">
                {/* <button className={"py-3 px-10 font-bold text-md bg-[rgb(250,250,250)] w-1/2 border-2 border-[rgb(234,236,239)] border-r-[1px] " +
                    (orderMode === "BUY" ? "border-t-[#0666eb] border-t-2 border-b-transparent bg-white text-black" : "bg-[#f6f8fa] text-[#707a8a]")}
                    onClick={e => setOrderMode("BUY")}>Buy</button> */}
                {/* <button className={"py-3 px-10 font-bold text-md bg-[rgb(250,250,250)] w-1/2 border-2 border-[rgb(234,236,239)] border-l-[1px] " +
                    (orderMode === "SELL" ? "border-t-[#0666eb] border-t-2 border-b-transparent bg-white text-black" : "bg-[#f6f8fa] text-[#707a8a]")}
                    onClick={e => setOrderMode("SELL")}>Sell</button> */}
                <button className="py-3 px-10 font-bold text-md  w-full border-2 border-[rgb(234,236,239)] border-l-[1px] border-t-[#0666eb] border-t-2 border-b bg-white text-black">Create new stock market order</button>
            </div>
            <div className="flex flex-row gap-5 space-x-5 px-5">
                <MarketOrderForm {...{ "type": "BUY", stock, latestTickersData, balance }} />
                <MarketOrderForm {...{ "type": "SELL", stock, latestTickersData, balance }} />
            </div>
        </div >
    )
}