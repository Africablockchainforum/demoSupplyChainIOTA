const IOTA = require("iota.lib.js");
const iota = new IOTA({
    provider: "https://nodes.testnet.iota.org:443"
    // provider: "https://nodes.devnet.thetangle.org:443"
    // provider: 'http://localhost:14700'

});
var pro = 
    {
        "preHash": "RNWPIOF9RCXRPLODGHAWGBFMJEMUEUWIDF9IOFEKCQTNHGZJWCFJGIRKYZITNDBFWQPZXVHGIDKVXY999",
        "product": {
            "name": "Cam",
            "amount": 1000
        }
    };


var transfers = [];
var sellerAdd = "B9FRJYOMMTTSHFKML9WVFIL9MSJ9MHYYJBFJXRNY9QPBERYGQULWCVUV9KRC9RNLXS9OVZHYCZCHOCCBY";
var balance = {data: null,status:null}; balance.data ={}
balance.data = {RNWPIOF9RCXRPLODGHAWGBFMJEMUEUWIDF9IOFEKCQTNHGZJWCFJGIRKYZITNDBFWQPZXVHGIDKVXY999 : 6000};
balance.status = true;
var seed = "RYNKKLOVKCPLZDGLOYUHVZJUVSVCNRSGKLRUOUHORFYZFRPDGPSVCFIXPFYZAZKKDRHJVKYQUTECZIWXH";
const depth = 3;
const minWeightMagnitude = 9;
transfers.push({
    value: 0,
    tag: "BALANCE",
    address: sellerAdd,
    message: iota.utils.toTrytes(JSON.stringify(balance))
})

iota.api.sendTransfer(seed, depth, minWeightMagnitude, transfers, (error, data) => {
    if (error) {
        throw (error);
    } else {
        console.log(data);
    }
})
// var da =  {RNWPIOF9RCXRPLODGHAWGBFMJEMUEUWIDF9IOFEKCQTNHGZJWCFJGIRKYZITNDBFWQPZXVHGIDKVXY999 : 5000};
// da = balance.data;
// // delete balance.data[pro.preHash];
// balance.data[seed] = 700;
// console.log(balance.data);
var sellerSeed = "RYNKKLOVKCPLZDGLOYUHVZJUVSVCNRSGKLRUOUHORFYZFRPDGPSVCFIXPFYZAZKKDRHJVKYQUTECZIWXH";
// iota.api.getAccountData(sellerSeed, (err, response) =>{
//     if (err) {
//         throw err;
//     }else{
//         console.log(response.addresses.length);
//     }
// })
// var arr =[];
// var a = "abc";
// for (let index = 10; index < 1000; index++) {
//     let obj = {abc : index}
//     arr.push(obj);    
// }
// arr.forEach(element => {
//     element[a] = parseInt(element[a]) - 9;
//                     if (element[a] == 0) {
//                         delete balanceSeller.data[pro.preHash];
//                     }                                          
//                     element[a] = 10;
// });
// console.log(arr)