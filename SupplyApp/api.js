const IOTA = require('iota.lib.js')
const iota = new IOTA({
    provider: "https://nodes.testnet.iota.org:443"
    // provider: "https://nodes.devnet.thetangle.org:443"
    // provider: 'http://localhost:14700'
})
const fs = require("fs")

const depth = 3;
const minWeightMagnitude = 9;

var user = [];
//load supplier in server
user = fs.readFileSync("../db.json");
user = JSON.parse(user);

function API() {}

API.prototype.getAddressAsync = async function(name){
};  
API.prototype.getBalanceAsync = async function(address){
};
API.prototype.getTxnAsync = async function(bal){
};    
API.prototype.getSeedAsync = async function(supplierName){
};
API.prototype.getNewAddress = async function(seed){
};    
API.prototype.sendRequestAsync = async function(buyerAdd){
};
API.prototype.pushToTransferAsync = async function(sellerAdd, newSellerAdd, buyerAdd, balanceSeller, products, transfers, responseData){
};    
API.prototype.sendBalanceAsync = async function(seed, ArrTxnObj){
};    

module.exports = API;