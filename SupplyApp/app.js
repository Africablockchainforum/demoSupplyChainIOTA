const API = require("./api.js");
const api = new API();

// Init
// Example VietIS
const seedVietIS = "UVJUSYDS9TXRHBUDUOYOYDKOUNJWAVQERKGNHXGUQVTKHQYQKINDKCVEFZHURTSIYBLESAICFLOJ9FNGX";
// Prepare Transfers    
// Set receiver
var receiverAddress = "";
// Set Product
var Product = [];
// Validate Product and create transfer
var transfers = [];
api.validateProduct(Product, (error, result) => {
    if (error) {
        console.log(error);
    } else if (!!result === false) {
        console.log(new Error("Product is not valid!"));
    } else if (!!result === true) {
        //create Transfers
        api.createTransfers(Product, (err, transfersResult) => {
            if (err) {
                console.log(err);                
            } else {
                transfers = transfersResult;
            }
        })
    }
})
// Request - Response Transfers and Send Transfers
api.requestTransfers(transfers, (error, response) => {
    if (error) {
        console.log(error);
    } else if (!!response === false) {
        console.log("Receiver reject it");
    } else if (!!response === true) {
        // Send Transfers            
        api.sendTransfers(seedVietIS, VietISAddress, receiverAddress,transfers, (error)=>{
            if (error) {
                console.log(error);                
            } else {
                console.log("Send Transfers successful!");                
            }
        })
    }
})
// Check result and export bill

