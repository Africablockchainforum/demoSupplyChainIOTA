const API = require("./api.js");
const api = new API();
// Init
const name = "Supplier D" // CHANGE NAME OF SUPPLIER


/*----------------------- DO NOT CHANGE ANY THING BELOW ------------------*/

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