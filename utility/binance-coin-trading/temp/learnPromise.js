
/*function waitAndPrint(ms,text){
    return new Promise((resolve)=>{
        setTimeout(()=>{
            console.log(text);
            resolve()
        },ms)
    });
}
const p = Promise.resolve()
            .then(()=>{return waitAndPrint(1234,'Người theo hương hoa mây mù giăng lối')})
            .then(()=>{return waitAndPrint(1234,'Làn sương khói phôi phai đưa bước ai xa rồi')})
            .then(()=>{return waitAndPrint(1234,'Đơn côi mình ta vấn vương')})
            .then(()=>{return waitAndPrint(1234,'Hồi ức, trong men say chiều mưa buồn')})
            .then(()=>{return waitAndPrint(1234,'Ngăn giọt lệ ngừng khiến khoé mi sầu bi')})
            .catch(err => console.log(err))*/

/*binance.balance((error, balances) => {
    if ( error ) return console.error(error);
    console.info("balances()", balances);
    console.info("ETH balance: ", balances.ETH.available);
});*/


async function wait(ms){
    return new Promise(resolve=>{
        setTimeout(()=>{
            resolve();
        },ms);
    });
}
async function getPrices(){
    for(let i = 0; i < 1000; ++i){
        let ticker = await binance.prices();
        console.info(`Price of ICX: ${ticker.ICXUSDT} `,i);
        await wait(2000)
        break
    }
}

getPrices();