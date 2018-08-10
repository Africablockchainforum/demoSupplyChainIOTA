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
    return new Promise(
        function (resolve) {            
            iota.api.findTransactionObjects({addresses: [address],tags: ["BALANCE"]}, (error, data) => {
                if (error) {                    
                    throw error;
                } else {   
                    try {
                        getObjectPromise(data[data.length - 1].signatureMessageFragment)
                        .then(balance=>{                                                      
                            resolve(balance);
                        }) 
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
            iota.api.getTransactionsObjects(Object.keys(balance), (error, arrTxnObj) => {
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
            })
        })
};

/**
 * this method is demo, in fact, do not use it, seed must be save in local
 * method get seed of supplier from name
 * @param {String} supplierName
 * @returns {String tryte-code}
 */
API.prototype.getSeedAsync = async function (supplierName) {};

/**
 * method create new address by seed
 * @param {String tryte-code} seed 
 * @returns {String tryte-code} address
 */
API.prototype.getNewAddress = async function (seed) {};

/**
 * method send to Buyer a request to confirm about product
 * @param {String tryte-code} buyerAdd address of buyer
 * @returns {Boolean} true if Buyer confirm other is false
 */
API.prototype.sendRequestAsync = async function (buyerAdd) {};

/**
 * method create new transfer with product and balance
 * @param {String tryte-code} sellerAdd Address of Seller
 * @param {String tryte-code} newSellerAdd new Address of Seller to send transfer and never reuses
 * @param {String tryte-code} buyerAdd Address of Buyer
 * @param {Object} balanceSeller {txnHash:amount}
 * @param {Array Object} products
 * @param {Object} responseData data or sign to varify this transaction
 */
API.prototype.pushToTransferAsync = async function (sellerAdd, newSellerAdd, buyerAdd, balanceSeller, products, responseData) {};

/**
 * 
 * @param {String tryte-code} seed 
 * @param {Array Object} ArrTxnObj 
 */
API.prototype.sendBuyerBalanceAsync = async function (seed, ArrTxnObj) {};

module.exports = API;