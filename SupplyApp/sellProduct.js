const API = require("./api.js");
const api = new API();

// Init
var supplierName = "Farmer A0";

// Prepare Transfers    
// Get receiver
var receiverName = "Supplier B";
// Get Products
var Products = [
    {
        "preHash": "RNWPIOF9RCXRPLODGHAWGBFMJEMUEUWIDF9IOFEKCQTNHGZJWCFJGIRKYZITNDBFWQPZXVHGIDKVXY999",
        "product": {
            "name": "Cam",
            "amount": 1000
        }
    }
];

/**
 * this function validate Products with buyer and send to network
 */
async function main() {    
    //Validate Product
    let sellerAdd = await api.getAddressAsync(supplierName);
    let balanceSeller = await getBalanceAsync(sellerAdd);
    // confirm product
    let buyerAdd = await api.getAddressAsync(receiverName);   
    let status = await api.sendRequestAsync(buyerAdd);
    if (status) {
        //send transfer             
        let seed = await api.getSeedAsync(supplierName); // seed must be save in local -- this is demo, so save in db.
        let newSellerAdd = api.getNewAddress(seed);    
        let ArrTxnObj = await api.pushToTransferAsync(sellerAdd, newSellerAdd, buyerAdd, balanceSeller, Products, responseData);    
        let status = await api.sendBuyerBalanceAsync(seed, ArrTxnObj); 
        if (status) {
            // Alert messenger successful
            Console.log("Sold Product: \n" + Products);
        } else {
            // Alert messenger error
            Console.log("Send Error !!!");
        }        
    }
    else{
        // Alert messenger error
        Console.log("Send request is reject !!!");
    }           
}

main();
