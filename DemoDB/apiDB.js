const IOTA = require("iota.lib.js");
const iota = new IOTA({
    provider: "https://nodes.testnet.iota.org:443"
    // provider: "https://nodes.devnet.thetangle.org:443"
    // provider: 'http://localhost:14700'

});
var seed = "CRTTXMWCNEPBNTAJFPP9ZBMZLNRDIGCTAYALRLNOFFRUUMUWDFRCBDGCVJVJ9DMODBIWXQASUUK9OERBF"
var addressSell = "DAI9IABCADYZEKSIQTFKHUURLRG9ZCFSCVDWOUFACMWVMUGNYDRRTRLWQDMDJYYWGWUPYXABARXMKISRD";
var addressBuy = "SHMBACOMVTEGCA9XEJYTFJOVMRKPJKDFIFPIHEZZ9CBE9WQJOZTBFY9YHMVL9WYOXNDRWILDTWLIDGXXX";

// iota.api.getNewAddress(seed, { total: 1, security: 1, index: 1 }, (error, response) => {
//     if (error) {
//         console.log(error);

//     } else {
//         addressInit = response;
//         console.log(response);

//     }

// })

var product = {
    "name": "Xoai",
    "amount": "30"
}

var Products = [{
    "preHash": "MPAOPYN9FUQTSYQAIXDBRE9QIKOPQXVGUDIRAGOHTCRTFDUPKGEKKNJVLEPTXSDDCKONDNSSJSWI9I999",
    "product": product
}];

var responseData = "true";

var msg = {
    "preHash": Products[0].preHash,
    "product": Products[0].product,
    "response": responseData
}
var balance = ["MPAOPYN9FUQTSYQAIXDBRE9QIKOPQXVGUDIRAGOHTCRTFDUPKGEKKNJVLEPTXSDDCKONDNSSJSWI9I999"]
var transfer = [{
    value: 0,
    tag: "BALANCE",
    address: addressSell,
    message: iota.utils.toTrytes(JSON.stringify(balance))
}
,{
    value: 0,
    tag: "SELL",
    address: addressSell,
    message: iota.utils.toTrytes(JSON.stringify(msg))
},{
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
    console.log(data);
})
// iota.api.findTransactionObjects({addresses:[addressIn],tags:["SELL"]},(error,txn)=>{
//     console.log(error,txn);
    
// })