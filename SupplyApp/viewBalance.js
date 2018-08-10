const LIB = require("./lib.js");
const API = require("./api.js");
const lib = new LIB();
const api = new API();

// Init
const name = "Farmer A0"

// lib.viewBalance(name);

async function main (){
    console.log(name);
    var address = await api.getAddressAsync(name);
    var bal = await api.getBalanceAsync(address);
    var product = await api.getTxnAsync(bal);
    console.log(product);
}

main();