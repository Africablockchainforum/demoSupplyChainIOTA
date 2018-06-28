const IOTA = require('iota.lib.js')
const iota = new IOTA({
    provider: "https://nodes.testnet.iota.org:443"
    // provider: "https://nodes.devnet.thetangle.org:443"
    // provider: 'http://localhost:14700'
})

const depth = 3;
const minWeightMagnitude = 9;

function API() { }

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

API.prototype.validateProducts = function (Products, sendAddress, callback) {
    try {
        Products.forEach(element => {
            if (getProduct(element, sendAddress) < 0) {
                return callback(null, false);
            }
        });
        return callback(null, true);
    } catch (error) {
        return callback(error);
    }
}

function getProduct(Product, sendAddress) {
    //load all Transaction of SendAddress
    iota.api.getTransactionsObjects([Product.preHash], (error, result) => {
        if (error) {
            console.log(error);
        } else {
            productB = JSON.parse(toMessage(result.signatureMessageFragment));
            return productB.product.amout - Product.product.amout;
        }

    })
}

API.prototype.requestTransfers = function (Product, receiverAddress, callback) {
    return callback(null, true);
}

API.prototype.createTransfers = function (Products, senderAddress, receiverAddress, callback) {
    try {
        let message = [];
        let transfers = [];
        let msg = [];
        // create transacion balace
        let changeBalace = false;
        let balace = [];
        // get balace if not exist then create new balace
        iota.api.findTransactionObjects({ addresses: [senderAddress], tags: [iota.utils.toTrytes("BALACE")] }, (error, txn) => {
            if (error) {
                console.log(error);
            } else {
                if (txn.length !== 0) {
                    // get balace
                } else {
                    //create balace
                                   
                }
            }
        })        
        Products.forEach(element => {
            if (getProduct(element, sendAddress) === 0) {
                // delete this product from balace
                changeBalace = true;
            }
        });     s
        if (changeBalace) {
            transfers.push({
                value: 0,
                tag: iota.utils.toTrytes("BALACE"),
                address: senderAddress,
                message: iota.utils.toTrytes(JSON.stringify(balace))
            })
        }

        // create msg Object
        for (let i = 0; i < Products.length; i++) {
            msg.push({
                "preHash": Products[i].preHash,
                "product": Products[i].product,
                "check": "true"
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

API.prototype.sendTransfers = function (seed, transfers, callback) {
    // create new Address
    // send init transfers
    // send Transfers
    iota.api.sendTransfer(seed, depth, minWeightMagnitude, transfers, (error, success) => {
        if (error) {
            return callback(error);
        } else {
            return callback(null, success);
        }
    })
}

API.prototype.checkTransfer = function (callback) {
    // process check status of Transfer. If all Transaction are confirm return true, other return false
    return callback(null, true);
}

module.exports = API;