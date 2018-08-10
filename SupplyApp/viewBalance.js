const API = require("./api.js");
const api = new API();

const LIB = require("./lib.js");
const lib = new LIB();
// Init
const name = "Farmer A0"
// const name = "Supplier B"

// lib.viewBalance(name);

async function main (){
    console.log(name);
    var address;
    var balance = null;
    var product;
    address = await api.getAddressAsync(name);
    if(address==null){
        console.log("Supplier is not exsit !!!");
        return;
    }   
    balance = await api.getBalanceAsync(address);    
    if(balance == null){        
        console.log("Supplier have no Porduct !!!");
        return;
    }else{        
        var product = await api.getTxnAsync(balance);
        if(product!==null){
            console.log(product);
        } else{
            console.log("Error !!!");
        }   
    }         
}

main();