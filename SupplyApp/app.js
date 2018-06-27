const API = require("./api.js");
const api = new API();

// Init
// Example VietIS
const seedVietIS = "UVJUSYDS9TXRHBUDUOYOYDKOUNJWAVQERKGNHXGUQVTKHQYQKINDKCVEFZHURTSIYBLESAICFLOJ9FNGX";
// Prepare Transfers    
// Set receiver
var receiverAddress = "";
// Set Products
var Products = [];
// Validate Products and send transfer
var transfers = [];
api.validateProducts(Products, (error, result) => {
    if (error) {
        console.log(error);
    } else if (!!result === false) {
        console.log(new Error("Products is not valid!"));
    } else if (!!result === true) {
        // Request - Response Transfers and Send Transfers
        api.requestTransfers(transfers, receiverAddress, (error, response) => {
            if (error) {
                console.log(error);
            } else if (!!response === false) {
                console.log("Receiver reject it");
            } else if (!!response === true) {
                //create Transfers
                api.createTransfers(Products, VietISAddress, receiverAddress, (err, transfersResult) => {
                    if (err) {
                        console.log(err);
                    } else {
                        transfers = transfersResult;
                    }
                })
                // Send Transfers            
                api.sendTransfers(seedVietIS, transfers, (error) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Send Transfers successful!");
                    }
                })
            }
        })
    }
})

// Check result and export bill

api.checkTransfer((error, result) => {
    if (error) {
        console.log(error);
    } else {
        if (result) {
            console.log("Print Bill");
        }
    }
})
