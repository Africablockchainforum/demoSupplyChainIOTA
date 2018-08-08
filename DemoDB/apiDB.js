const IOTA = require("iota.lib.js");
const iota = new IOTA({
    provider: "https://nodes.testnet.iota.org:443"
    // provider: "https://nodes.devnet.thetangle.org:443"
    // provider: 'http://localhost:14700'

});

var seed = "RYNKKLOVKCPLZDGLOYUHVZJUVSVCNRSGKLRUOUHORFYZFRPDGPSVCFIXPFYZAZKKDRHJVKYQUTECZIWXH"
var addressSell = "B9FRJYOMMTTSHFKML9WVFIL9MSJ9MHYYJBFJXRNY9QPBERYGQULWCVUV9KRC9RNLXS9OVZHYCZCHOCCBY";
var addressBuy = "JQCTJLB9RMT9MVFDBHKUCBNCIYXZKOMHUSN9XJWWURIDXTSWWD9WENJBFOEKMQLWXJUDXHCCPDDAP9Z9D";
var addressNew=""
iota.api.getNewAddress(seed, { total: 1, security: 1, index: 1 }, (error, response) => {
    if (error) {
        console.log(error);

    } else {
        addressNew = response;
        // console.log(response);

    }

})

var product = {
    "name": "Cam",
    "amount": "1000"
}

var Products = [{
    "preHash": "RNWPIOF9RCXRPLODGHAWGBFMJEMUEUWIDF9IOFEKCQTNHGZJWCFJGIRKYZITNDBFWQPZXVHGIDKVXY999",
    "product": product
}];

var responseData = "true";

var msg = {
    "preHash": Products[0].preHash,
    "product": Products[0].product,
    "response": responseData
}
var balance = {
    "RNWPIOF9RCXRPLODGHAWGBFMJEMUEUWIDF9IOFEKCQTNHGZJWCFJGIRKYZITNDBFWQPZXVHGIDKVXY999":2000,
    "UPBHAWATJFVXFRMJHDPYQJMAKP9QLMGJUULRRJLITHXRULGICNHECICSLJTHWMKAWDGASAWJATSUUH999":3000
    // "RABPDVYPOI9JGIHWCHLLJP9NALPXFRRVXHGPHMKYUKPMKDRHPGJBAI9KOQ9HKYDGXJOERTLCGHLCLC999":1000
}
var transfer = [
    {
    value: 0,
    tag: "BALANCE",
    address: addressSell,
    message: iota.utils.toTrytes(JSON.stringify(balance))
},
// {
//     value: 0,
//     tag: "BALANCE",
//     address: addressBuy,
//     message: iota.utils.toTrytes(JSON.stringify(balance))
// }
// ,
{
    value: 0,
    tag: "SELL",
    address: addressSell,
    message: iota.utils.toTrytes(JSON.stringify(msg))
}
,
{
    value: 0,
    tag: "BUY",
    address: addressBuy,
    message: iota.utils.toTrytes(JSON.stringify(msg))
}
]
// iota.api.prepareTransfers(seed,transfer,(error,res)=>{
//     console.log(error,res);
    
// })
iota.api.sendTransfer(seed, 3, 9, transfer, (error, data) => {
    console.log(error,data);
})
// iota.api.findTransactionObjects({addresses:[addressIn],tags:["SELL"]},(error,txn)=>{
//     console.log(error,txn);
    
// })

