const IOTA = require('iota.lib.js')
const iota = new IOTA({
    provider: 'http://localhost:14700'
})

function API() {}
/**
 * 
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
 * 
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
            let msg = JSON.parse(toMessage(txn[0].signatureMessageFragment));
            history = getHistory(msg.preHash,history);
        }
    })
    return history;
}
/**
 * 
 * @param {String} address 
 * @param {function} callback 
 */
API.prototype.getInforAddress = function (address, callback) {
    let addresses = {
        "addresses": [address]
    };
    iota.api.findTransactionObjects(addresses, (error, txn) => {
        if (error) {
            return callback(error);
        } else {
            txn.forEach(element => {
                let msg = JSON.parse(toMessage(element.signatureMessageFragment));
                if (msg.type === "init") {
                    return callback(null, msg.name + " | " + msg.address);
                }
            });
            return callback(null, "Empty!")
        }
    })
}

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
            let msg = JSON.parse(toMessage(txn[0].signatureMessageFragment));
            history = getHistory(msg.preHash, history);
        }
    })
    return callback(null,history);
}

module.exports = API;