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

/**
 * method convert from {trytes-code} trytes to {string} message
 * @param {String trytes_encode} trytes 
 * @returns {Object} object in message
 */

async function getObjectPromise(trytes) {
    return new Promise(
        function (resolve, reject) {
            try {
                temp = trytes.split("").reverse();
                var indexEnd = 0;
                for (let index = 0; index < temp.length; index++) {
                    if (temp[index] != '9') {
                        indexEnd = index;
                        break;
                    }
                }
                resolve(JSON.parse(iota.utils.fromTrytes(trytes.toString().substring(0, trytes.length - indexEnd))));   
            } catch (error) {
                reject(null);
            }            
        });
}

function API() {}

/**
 * method get address of supplier from name
 * @param {String} supplierName
 * @returns {String tryte-code} address
 */
API.prototype.getAddressAsync = async function (supplierName) {
    return new Promise(
        function (resolve) {
            let status = false;
            user.forEach(element => {
                if (element.Name == supplierName) {
                    status = true;
                    resolve(element.Address)
                }
            });
            if (!status) {
                resolve(null);
            }
        }
    )
};

/**
 * method get last Transaction have tag is BALANCE and read message
 * @param {String tryte-code} address
 * @return {Object} Object balance of account: {txnHash:amount}
 */
API.prototype.getBalanceAsync = async function (address) {    
    var bal =null;
    return new Promise(
        function (resolve) {            
            iota.api.findTransactionObjects({addresses: [address],tags: ["BALANCE"]}, (error, data) => {
                if (error) {                    
                    throw error;
                } else { 
                    if(data.length == 0){
                        resolve(bal);
                    }  
                    try {
                        data.forEach(element => {
                            getObjectPromise(element.signatureMessageFragment)
                            .then(balance =>{                                                                                                                            
                                if (balance.status == true) {                                                                                                                                               
                                    bal = balance;                                                                                                            
                                }
                                if(element == data[data.length-1]){
                                    resolve(bal);
                                }
                            })
                        });                               
                    } catch (err) {
                        resolve(null);
                    }                                                                                              
                }
            })
        }
    )
};

/**
 * Browse through Object balance by key (address) and get infor transaction by address
 * @param {Object} balance {txnHash:amount}
 * @returns {Array Object} 
 */
API.prototype.getTxnAsync = async function (balance) {
    var product = [];           
    return new Promise(
        function (resolve) {
            iota.api.getTransactionsObjects(Object.keys(balance.data), (error, arrTxnObj) => {
                if (error) {                    
                    throw error;
                } else {                                                        
                    arrTxnObj.forEach(txn => {
                        let pro;
                        let hash;
                        let amount;
                        getObjectPromise(txn.signatureMessageFragment)
                            .then(object => {
                                pro = object;
                                hash = txn.hash;
                                amount = balance.data[hash];
                                product.push({
                                    "name": pro.product.name,
                                    "amount": amount,
                                    "hash": hash,
                                });

                            })
                    });
                    resolve(product);                                                                          
                }
            })
        })
};

/**
 * this method is demo, in fact, do not use it, seed must be save in local
 * method get seed of supplier from name
 * @param {String} supplierName
 * @returns {String tryte-code}
 */
API.prototype.getSeedAsync = async function (supplierName) {
    return new Promise(
        function (resolve) {            
            user.forEach(element => {
                if (element.Name == supplierName) {                    
                    resolve(element.Seed)
                }
            });            
        }
    )
};

/**
 * method send to Buyer a request to confirm about product
 * @param {String tryte-code} buyerAdd address of buyer
 * @returns {Boolean} true if Buyer confirm other is false
 */
API.prototype.sendRequestAsync = async function (buyerAdd) {
    let responseData = {data: null,status:null};
    responseData.status = true;
    responseData.data = true;
    return responseData;
};

/**
 * method create new transfer with product and balance
 * @param {String tryte-code} sellerSeed to create new Seller Address to send transfer and never reuse it 
 * @param {String tryte-code} sellerAdd Address of Seller
 * @param {String tryte-code} buyerAdd Address of Buyer
 * @param {Object} balanceSeller {txnHash:amount}
 * @param {Object} balanceBuyer {txnHash:amount}
 * @param {Array Object} products
 * @param {Object} responseData data or sign to verify this transaction
 * @returns {Array Object}
 */
API.prototype.pushToTransferAsync = async function (sellerSeed, sellerAdd, buyerAdd, balanceSeller, balanceBuyer, products, responseData) {
    transfers = [];
    // create new address
    var newSellerAdd=[];
           
        iota.api.getNewAddress(sellerSeed, { total: 1, security: 1, index: 2 }, (error, response) => {
            if (error) {
                throw error;
            } else {
                newSellerAdd = response;

            }
        })
       
    return new Promise(
        function (resolve, reject) {
            try {
                products.forEach(pro => {
                    console.log(balanceSeller.data[pro.preHash]);
                    console.log(balanceBuyer.data[pro.preHash]);
                    console.log("ABC");
                    balanceSeller.data[pro.preHash] = parseInt(balanceSeller.data[pro.preHash]) - pro.amount;
                    if (balanceSeller.data[pro.preHash] == 0) {
                        delete balanceSeller.data[pro.preHash];
                    }                                          
                    balanceBuyer.data[pro.preHash] = pro.amount;
                    console.log(balanceSeller);
                    console.log(balanceBuyer);
                    console.log("ABC");
                });
                balanceSeller.status = responseData; // it is very important to verify transaction is validate
                balanceBuyer.status = responseData; // it is very important to verify transaction is validate                

                let message = [];

                // create msg Object
                for (let i = 0; i < products.length; i++) {
                    let msg = {
                        "preHash": products[i].preHash,
                        "product": products[i].product,
                        "status": responseData
                    }
                    message.push(iota.utils.toTrytes(JSON.stringify(msg)));
                }
                //push input to transfers
                for (let index = 0; index < products.length; index++) {
                    transfers.push({
                        value: 0,
                        tag: "SELL",
                        address: newSellerAdd[0],
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
                transfers.push({
                    value: 0,
                    tag: "BALANCE",
                    address: sellerAdd,
                    message: iota.utils.toTrytes(JSON.stringify(balanceSeller))
                })
                
                transfers.push({
                    value: 0,
                    tag: "BALANCE",
                    address: buyerAdd,
                    message: iota.utils.toTrytes(JSON.stringify(balanceBuyer))
                })
                console.log(balanceBuyer);
                console.log(balanceSeller);
                resolve(transfers);
            } catch (error) {
                reject(error);
            }
        })
};

/**
 * method send transfer to network
 * @param {String tryte-code} seed 
 * @param {Array Object} transfers 
 */
API.prototype.sendTransferAsync = async function (seed, transfers) {    
    // return new Promise(
    //     function (resolve) {    
    //         iota.api.sendTransfer(seed, depth, minWeightMagnitude, transfers, (error, data) => {        
    //             if (error) {
    //                 throw error;
    //             } else {
    //                 resolve(data);
    //             }
    //         })
    //     }
    // )
};

module.exports = API;