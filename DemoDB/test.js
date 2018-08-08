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
user = fs.readFileSync("E:\\Study and Job\\Job\\VietIS\\BlockChain\\SupplyChain\\demoSupplyChainIOTA\\db.json")
user = JSON.parse(user);
/**
 * method convert from {trytes-code} trytes to {string} message
 * @param {String trytes_encode} trytes 
 * @returns {Object} object in message
 */
function getObjectPromise(trytes) {
    return new Promise(
        function (resolve, reject) {
            temp = trytes.split("").reverse();
            var indexEnd = 0;
            for (let index = 0; index < temp.length; index++) {
                if (temp[index] != '9') {
                    indexEnd = index;
                    break;
                }
            }
            resolve(JSON.parse(iota.utils.fromTrytes(trytes.toString().substring(0, trytes.length - indexEnd))));
        });
}
/**
 * method get last Transaction have tag is BALANCE and read message
 * @param {String} address Address of account want to get balance
 * @returns {Object} Object balance of account: {txnHash:amount}
 */

function getBalancePromise(address) {
    return new Promise(
        function getBalance(resolve, reject) {
            let balance;          
            iota.api.findTransactionObjects({ addresses: [address], tags: ["BALANCE"] }, (error, data) => {
                if (error) {
                    reject(error);
                } else {

                    balance = getObject(data[data.length - 1].signatureMessageFragment);                   
                    resolve(balance);
                }
            })
        }
    )
}

function getObject(trytes) {
    temp = trytes.split("").reverse();
    var indexEnd = 0;
    for (let index = 0; index < temp.length; index++) {
        if (temp[index] != '9') {
            indexEnd = index;
            break;
        }
    }

    return JSON.parse(iota.utils.fromTrytes(trytes.toString().substring(0, trytes.length - indexEnd)));
}
/**
 * method get sender seed from console and validate
 * @param {function} callback 
 * @returns {String} Seed of supplier Name
 */
function getSeedPromise(supplierName) {
    return new Promise(
        function (resolve, reject) {
            getSeed(supplierName, (error, seed) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(seed);
                }
            })
        });
}
function getSeed(supplierName, callback) {
    let status = false;
    user.forEach(element => {
        if (element.Name == supplierName) {
            status = true;
            return callback(null, element.Seed)
        }
    });
    if (!status) {
        return callback(new Error("Supplier Name is not exist !!!"));
    }
}
/**
 * method get receiver address from console and validate
 * @param {function} callback 
 * @returns {String} Address of supplier Name
 */
function getAddressPromise(supplierName) {
    return new Promise(
        function (resolve, reject) {
            getAddress(supplierName, (error, add) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(add);
                }
            })
        });
}
function getAddress(supplierName, callback) {
    let status = false;
    user.forEach(element => {
        if (element.Name == supplierName) {
            status = true;
            return callback(null, element.Address)
        }
    });
    if (!status) {
        return callback(new Error("Supplier Name is not exist !!!"));
    }
}

/**
 * method send a request to buyer and buyer validate then response status
 * @param {String} buyerAdd buyer address
 * @param {Function} callback 
 */
function sendRequestPromise(buyerAdd) {
    return new Promise(
        function (resolve, reject) {
            sendRequest(buyerAdd, (error, res) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(res);
                }
            })
        }
    )
}
function sendRequest(buyerAdd, callback) {
    let response = {
        status: true,
        data: "true"
    };
    return callback(null, response);
}

function getTxnPromise(balance) {
    return new Promise(
        function (resolve, reject) {
            iota.api.getTransactionsObjects(Object.keys(balance), (error, arrTxnObj) => {
                let product = [];
                if (error) {
                    reject(error);
                } else {
                    arrTxnObj.forEach(txn => {
                        let pro;
                        let hash;
                        let amount;
                        getObjectPromise(txn.signatureMessageFragment)
                            .then(object => {
                                pro = object;
                                hash = txn.hash;
                                amount = balance[hash];
                                product.push({
                                    "name": pro.product.name,
                                    "amount": amount,
                                    "hash": hash,
                                });

                            })
                    });
                    resolve(product);
                }
                // console.log(product);
            })

        })
}

function LIB() { }

/**
 * function show balance of supplier
 * @param {String} supplierName name of supplier
 */
LIB.prototype.viewBalance = function (supplierName) {
    let address = "";
    let balance;
    getAddress(supplierName, (error, add) => {
        if (error) {
            console.log(error);
        } else {
            address = add;
        }
    })

    getBalancePromise(address)
        .then(bal => {
            balance = bal;
            getTxnPromise(balance)
                .then(products => {
                    console.log(products);
                })
        })
    // get Product Name                        

}

LIB.prototype.sellProduct = function (supplierSellName, supplierBuyName, products, callback) {
    // validate product
    let buyerAdd;
    let sellerAdd;
    let seed
    let newSellerAdd;
    let balanceSeller;
    let responseData;
    let transfers = [];
    getAddressPromise(supplierBuyName)
        .then(add => {
            buyerAdd = add;
            getAddressPromise(supplierSellName)
                .then(address => {
                    sellerAdd = address;
                    getSeedPromise(supplierSellName)
                        .then(data => {
                            seed = data;
                            iota.api.getNewAddress(seed, { total: 1, security: 1, index: 1 }, (error, response) => {
                                if (error) {
                                    return callback(error);
                                } else {
                                    newSellerAdd = response;
                                }
                            })                            
                            getBalancePromise(sellerAdd)
                                .then(bal => {
                                    balanceSeller = bal;
                                    if (!!!balanceSeller) {
                                        return callback(new Error("Get Balance is fail !!!"));
                                    }
                                    products.forEach(pro => {
                                        let hash = pro.preHash;
                                        if (pro.amount > parseInt(balanceSeller[hash])) {
                                            return callback(new Error(pro.name + " is not enough!!!"));
                                        }
                                    });
                                    sendRequestPromise(buyerAdd)
                                        .then(res => {
                                            if (!!!res.status) {
                                                return callback(new Error("Buy reject this transaction!!!"));
                                            } else {
                                                responseData = res;
                                                // sendTransfer
                                                // create Transfer    
                                                // create balance message    
                                                pushToTransfersPromise(sellerAdd, newSellerAdd, buyerAdd, balanceSeller, products, transfers,responseData)
                                                    .then(transfers => {
                                                        console.log(transfers);
                                                        
                                                        //send to IOTA network    
                                                        iota.api.sendTransfer(seed, depth, minWeightMagnitude, transfers, (error, ArrTxnObj) => {
                                                            if (error) {
                                                                return callback(error);
                                                            } else {
                                                                // write ArrTxnObj to file log
                                                                console.log("Sell products successful");
                                                                sendBalancePromise(seed, ArrTxnObj)
                                                                    .then(status => {
                                                                        return callback(null, status);
                                                                    })
                                                                    .catch(error => {
                                                                        return callback(error);
                                                                    })
                                                            }
                                                        })
                                                    })
                                                    .catch(error => {
                                                        return callback(error);
                                                    })
                                            }
                                        })
                                        .catch(error => {
                                            return callback(error);
                                        })
                                })
                                .catch(error => {
                                    return callback(error);
                                })
                        })
                        .catch(error => {
                            return callback(error);
                        })
                })
                .catch(error => {
                    return callback(error);
                })
        })
        .catch(error => {
            return callback(error);
        })
}
function sendBalancePromise(seed, arrTxn) {
    return new Promise(
        function (resolve, reject) {
            sendBalance(seed, arrTxn, (error, status) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(status);
                }
            })

        }
    )
}
function sendBalance(buyerAdd, seed, arrTxn, callback) {
    let transfers2 = [];
    let balanceBuyer;
    getBalance(buyerAdd, (error, bal) => {
        if (error) {
            console.log(error);
        } else {
            balanceBuyer = bal;
        }

    });
    getBalancePromise(buyerAdd)
        .then(bal => {
            balanceBuyer = bal;
            if (!!!balanceBuyer) {
                return callback(new Error("Buyer have not balance !!!"));
            }
            arrTxn.forEach(txn => {
                let tag = iota.utils.fromTrytes(txn.tag);
                if (tag.indexOf("BUY") >= 0) {
                    let pro = getObject(txn.signatureMessageFragment);
                    balanceBuyer[txn.hash] = pro.amount;
                }
            });
            transfers2.push({
                value: 0,
                tag: "BALANCE",
                address: buyerAdd,
                message: iota.utils.toTrytes(JSON.stringify(balanceBuyer))
            })
            iota.api.sendTransfer(seed, depth, minWeightMagnitude, transfers2, (error, ArrTxnObj) => {
                if (error) {
                    return callback(error);
                } else {
                    // write ArrTxnObj to file log
                    console.log("Sell products successful");
                    return callback(null, true);
                }
            })
        })



}

function pushToTransfersPromise(sellerAdd, newSellerAdd, buyerAdd, balanceSeller, products, transfers,responseData) {
    return new Promise(
        function (resolve, reject) {
            try {
                products.forEach(pro => {
                    balanceSeller[pro.preHash] = parseInt(balanceSeller[pro.preHash]) - pro.amount;
                    if (balanceSeller[pro.preHash] == 0) {
                        delete balanceSeller[pro.preHash];
                    }
                });

                transfers.push({
                    value: 0,
                    tag: "BALANCE",
                    address: sellerAdd,
                    message: iota.utils.toTrytes(JSON.stringify(balanceSeller))
                })
                let message = [];

                // create msg Object
                for (let i = 0; i < products.length; i++) {
                    let msg = {
                        "preHash": products[i].preHash,
                        "product": products[i].product,
                        "response": responseData
                    }
                    message.push(iota.utils.toTrytes(JSON.stringify(msg)));
                }
                //push input to transfers
                for (let index = 0; index < products.length; index++) {
                    transfers.push({
                        value: 0,
                        tag: "SELL",
                        address: newSellerAdd,
                        message: message[index]
                    })
                }
                //push output to transfers
                for (let index = 0; index < products.length; index++) {
                    transfers.push({
                        value: 0,
                        tag: "BUY",
                        address: buyerAdd,
                        message: message[index]
                    })
                }
                resolve(transfers);
            } catch (error) {
                reject(error);
            }
        })
}



module.exports = LIB;