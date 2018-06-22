const IOTA = require('iota.lib.js')
const iota = new IOTA({
    provider: 'http://localhost:14700'
})

const depth = 3;
const minWeightMagnitude = 9;

function API() {}

API.prototype.validateProduct = function (Product, sendAddress, callback) {    
}

API.prototype.createTransfers = function (data, senderAddress, receiverAddress, callback) {
    try {
        var messageInput = [];
        var messageOutput = [];
        var transfers = [];
        var msgInput = [];
        var msgOutput = [];
        // create msg Object
        for (let i = 0; i < data.length; i++) {
            msgInput.push({
                "type": "sell",
                "preHash": data[i].preHash,
                "product": data[i].product
            })

            msgOutput.push({
                "type": "buy",
                "preHash": data[i].preHash,
                "product": data[i].product
            })
        }

        //create message
        for (let i = 0; i < data.length; i++) {
            messageInput[i] = iota.utils.toTrytes(JSON.stringify(msgInput[i]));
            messageOutput[i] = iota.utils.toTrytes(JSON.stringify(msgOutput[i]));
        }

        //push input to transfers
        for (let index = 0; index < data.length; index++) {
            transfers.push({
                value: 0,
                tag: iota.utils.toTrytes(data[index].tag),
                address: senderAddress,
                message: messageInput[index]
            })
        }
        //push output to transfers
        for (let index = 0; index < data.length; index++) {
            transfers.push({
                value: 0,
                tag: iota.utils.toTrytes(data[index].tag),
                address: receiverAddress,
                message: messageOutput[index]
            })
        }
        return callback(null, transfers);
    } catch (error) {
        return callback(new Error("Create Transfers Fail!"))
    }
}

API.prototype.requestTransfers = function (Product, receiverAddress, callback) {}

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
module.exports = API;