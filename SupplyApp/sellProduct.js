const API = require("./api.js");
const api = new API();
const READLINE = require('readline');
const readline = READLINE.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Init
// Example VietIS
const seedVietIS = "UVJUSYDS9TXRHBUDUOYOYDKOUNJWAVQERKGNHXGUQVTKHQYQKINDKCVEFZHURTSIYBLESAICFLOJ9FNGX";

// choose function
readline.question("1. View Balance \n2.Send Transfer \nEnter your choose (defualt is 1): ", (answer) => {
    if (answer == "2") {
        send();
        readline.close;
    } else {
        
    }
});
function send() {
    // Prepare Transfers    
    // Get receiver
    var receiverAddress;
    api.getReceiverAddress((error, add) => {
        if (error) {
            console.log(error);
            process.exit(0);
        } else {
            receiverAddress = add;
        }
    })
    // Get Products
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
                } else if (!!response.status === false) {
                    console.log("Receiver reject it");
                } else if (!!response.status === true) {
                    //create Transfers
                    api.createTransfers(Products, VietISAddress, receiverAddress, response.data, (err, transfersResult) => {
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
}

function view() {
    
}