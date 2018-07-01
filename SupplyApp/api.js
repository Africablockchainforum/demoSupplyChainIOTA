const IOTA = require('iota.lib.js')
const iota = new IOTA({
    provider: "https://nodes.testnet.iota.org:443"
    // provider: "https://nodes.devnet.thetangle.org:443"
    // provider: 'http://localhost:14700'
})
const READLINE = require('readline');
const readline = READLINE.createInterface({
    input: process.stdin,
    output: process.stdout
});

const depth = 3;
const minWeightMagnitude = 9;

function API() { }
/**
 * method get receiver address from console and validate
 * @param {function} callback 
 */
API.prototype.getReceiverAddress = function (callback){
    readline.question('Input Receiver Address: ', (answer) => {
        if (iota.valid.isAddress(answer)) {
            return callback(null, answer);
        } else {
            return callback(new Error("Address is Invalid"))
        }
    });
}

/**
 * method convert from {trytes-code} trytes to {string} message
 * @param {String trytes_encode} trytes 
 * @returns {String} message
 */
function toMessage(trytes) {
    temp = trytes.split("").reverse();
    var indexEnd = 0;
    for (let index = 0; index < temp.length; index++) {
        if (temp[index] != '9') {
            indexEnd = index;
            break;
        }
    }

    return iota.utils.fromTrytes(trytes.toString().substring(0, trytes.length - indexEnd));
}

/**
 * method validate each Product by function getBalance
 * @param {Array} Products 
 * @param {String} sendAddress trytes-code address
 * @param {function} callback 
 */
API.prototype.validateProducts = function (Products, sendAddress, callback) {
    try {
        Products.forEach(element => {
            if (getBalance(element, sendAddress) < 0) {
                return callback(null, false);
            }
        });
        return callback(null, true);
    } catch (error) {
        return callback(error);
    }
}

/**
 * method get all buy and sell amount then calculate balance. If sendAddress is not contain prehash return -1
 * @param {Object} Product  {name,amout,etc...} product to sell
 * @param {String} sendAddress trytes-code address 
 * @returns {Number} balance of product in sendAddress
 */
function getBalance(Product, sendAddress) {
    //load all Transaction of SendAddress
    let amountSell = 0;
    let amountBuy = 0;
    iota.api.findTransactionObjects({addresses:[sendAddress],tags:"SELL"},(error,data)=>{
        if (error) {
            console.log(error);
        } else {
            data.forEach(element => {                
                let product = JSON.parse(toMessage(element.signatureMessageFragment));
                if (product.preHash === Product.preHash) {
                    amountSell += product.amount;
                }                
            });
        }        
    })
    iota.api.getTransactionsObjects([Product.preHash], (error, result) => {
        if (error) {
            console.log(error);
        } else {
            if (result.hash !== sendAddress) {
                return -1;
            }
            let product = JSON.parse(toMessage(result.signatureMessageFragment));
            amountBuy = product.amount;
        }

    })
    return amountBuy - amountSell;
}

/**
 * method send a request to Receiver make sure that product is the same with reallife
 * @param {Object} Product  {name,amout,etc...} product to sell
 * @param {String} receiverAddress  trytes-code address 
 * @param {function} callback 
 */
API.prototype.requestTransfers = function (Product, receiverAddress, callback) {
    let response = {
        status: true,
        data: true
    }
    return callback(null, response);
}

/**
 * method create Transfers 
 * @param {Object} Products     {name,amout,etc...} product to sell
 * @param {String} senderAddress    trytes-code address
 * @param {String} receiverAddress  trytes-code address
 * @param {function} callback 
 */
API.prototype.createTransfers = function (Products, senderAddress, receiverAddress, responseData, callback) {
    try {
        let message = [];
        let transfers = [];
        let msg = [];
        // create transacion balance
        let changeBalance = false;
        let balance = [];
        // get balance if not exist then create new balance
        iota.api.findTransactionObjects({ addresses: [senderAddress], tags: [iota.utils.toTrytes("balance")] }, (error, txn) => {
            if (error) {
                console.log(error);
            } else {
                if (txn.length !== 0) {
                    // get balance
                    balance = JSON.parse(toMessage(txn.signatureMessageFragment));
                } else {
                    //create balance
                    iota.api.findTransactionObjects({addresses:[sendAddress],tags:"BUY"},(error,data)=>{
                        if (error) {
                            console.log(error);
                        } else {
                            data.forEach(element => {                
                                balance.push(element.hash); 
                                changeBalance = true;               
                            });
                        }        
                    })
                }
            }
        })        
        Products.forEach(element => {
            if (getBalance(element, sendAddress) === 0) {
                // delete this product from balance
                balance.splice(balance.indexOf(element.hash),1);
                changeBalance = true;
            }
        });     
        if (changeBalance) {
            transfers.push({
                value: 0,
                tag: iota.utils.toTrytes("BALANCE"),
                address: senderAddress,
                message: iota.utils.toTrytes(JSON.stringify(balance))
            })
        }

        // create msg Object
        for (let i = 0; i < Products.length; i++) {
            msg.push({
                "preHash": Products[i].preHash,
                "product": Products[i].product,
                "response": responseData
            })
        }

        //create message
        for (let i = 0; i < Products.length; i++) {
            message[i] = iota.utils.toTrytes(JSON.stringify(msg[i]));
        }

        //push input to transfers
        for (let index = 0; index < Products.length; index++) {
            transfers.push({
                value: 0,
                tag: iota.utils.toTrytes("SELL"),
                address: senderAddress,
                message: message[index]
            })
        }
        //push output to transfers
        for (let index = 0; index < Products.length; index++) {
            transfers.push({
                value: 0,
                tag: iota.utils.toTrytes("BUY"),
                address: receiverAddress,
                message: message[index]
            })
        }
        return callback(null, transfers);
    } catch (error) {
        return callback(new Error("Create Transfers Fail!"))
    }
}

/**
 * method init new address and send transfer
 * @param {String} seed     trytes-code address
 * @param {Object} transfers  transfer to send
 * @param {function} callback 
 */
API.prototype.sendTransfers = function (seed, transfers, callback) {
    // create new Address
    let newAdd = ""
    iota.api.getNewAddress(seed,{total:1},(error,address)=>{
        newAdd = address;
    })
    // send Transfers
    iota.api.sendTransfer(seed, depth, minWeightMagnitude, transfers, (error, success) => {
        if (error) {
            return callback(error);
        } else {
            return callback(null, success);
        }
    })
}

/**
 * method check status of transfer. If it is confirm return true
 * @param {function} callback 
 */
API.prototype.checkTransfer = function (callback) {
    // process check status of Transfer. If all Transaction are confirm return true, other return false
    return callback(null, true);
}

/**
 * method print the bill
 * @param {Object} Products     {name,amout,etc...} product to sell
 */
API.prototype.printBill = function(Products){
    console.log("Bill:");    
    console.log(Products);    
}

API.prototype.viewbalance = function (address){
    let balance = [];
    iota.api.findTransactionObjects({addresses:[address],tags:"BALANCE"},(error,data)=>{
        if (error) {
            console.log(error);
        } else {
            data.forEach(element => {                
                balance = JSON.parse(toMessage(element.signatureMessageFragment));
                getBalance() 
            });
        }        
    })
}

module.exports = API;