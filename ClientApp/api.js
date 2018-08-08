const IOTA = require('iota.lib.js')
const iota = new IOTA({
    provider: "https://nodes.testnet.iota.org:443"
    // provider: "https://nodes.devnet.thetangle.org:443"
    // provider: 'http://localhost:14700'
})
const fs = require("fs");
var supplier;

// load supplier in server
fs.readFile("E:\\Study and Job\\Job\\VietIS\\BlockChain\\SupplyChain\\demoSupplyChainIOTA\\db.json", (err, data) => {
    if (err) {
        console.log(err);
    } else {
        supplier = JSON.parse(data);
    }
})

/**
 * method convert signatureMessageFragment in transaction to string message
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
 * method get information of supplier from address
 * @param {String} address 
 * @param {function} callback 
 */
function getInforAddress(address, callback) {
    let status = false;
    supplier.forEach(element => {
        if (element.Address.indexOf(address) >= 0) {
            status = true;
            return callback(null, element.Name);

        }
    });
    if (!status) {
        return callback("Supplier is undefined");
    }
}

/**
 * method search history transfer of a product with hash
 * @param {Hash} transactionHash 
 * @param {Array} history 
 */
function getHistory(transactionHash, history) {
    let hashed = [transactionHash];
    iota.api.getTransactionsObjects(hashed, (error, txn) => {
        if (error) {
            console.log(error);
        } else {
            history.push(txn[0].address);
            getInforAddress(txn[0].address, (err, data) => {
                if (err) {
                    console.log(err);

                } else {
                    console.log(data);
                }
            });
            let msg = JSON.parse(toMessage(txn[0].signatureMessageFragment));
            if (iota.valid.isAddress(msg.preHash)) {
                history = getHistory(msg.preHash, history);
            }
        }
    })
    return history;
}

function API() { }

/**
 * 
 * @param {String} transactionHash 
 * @param {function} callback 
 */
API.prototype.getSupply = function (transactionHash, callback) {
    var history = [];
    let hashed = [transactionHash];
    iota.api.getTransactionsObjects(hashed, (error, txn) => {
        if (error) {
            return callback(error);
        } else {
            history.push(txn[0].address);
            getInforAddress(txn[0].address, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(data);
                }
            });
            let msg = JSON.parse(toMessage(txn[0].signatureMessageFragment));
            if (iota.valid.isAddress(msg.preHash)) {
                history = getHistory(msg.preHash, history);
            }
        }
    })
    return callback(null, history);
}

module.exports = API;