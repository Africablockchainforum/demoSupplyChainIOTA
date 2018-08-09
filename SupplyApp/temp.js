/**
 * method convert from {trytes-code} trytes to {string} message
 * @param {String trytes_encode} trytes 
 * @returns {Object} object in message
 */
API.prototype.getObjectAsync = async function getObjectAsync(trytes) {
    temp = trytes.split("").reverse();
    var indexEnd = 0;
    for (let index = 0; index < temp.length; index++) {
        if (temp[index] != '9') {
            indexEnd = index;
            break;
        }
    }
    return (JSON.parse(iota.utils.fromTrytes(trytes.toString().substring(0, trytes.length - indexEnd))));
}

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
 * function show balance of supplier
 * @param {String} supplierName name of supplier
 */
API.prototype.viewBalanceAsync = async function (supplierName) {
    var address = await getAddressAsync(supplierName);
    var bal = await getBalanceAsync(address);
    var product = await getTxnAsync(bal);
    console.log(product);
    // get Product Name  
}

/**
 * method get last Transaction have tag is BALANCE and read message
 * @param {String} address Address of account want to get balance
 * @returns {Object} Object balance of account: {txnHash:amount}
 */

API.prototype.getBalanceAsync = async function getBalanceAsync(address) {
    console.log(address);
    return new Promise(
        function (resolve, reject) {
            let balance;
            iota.api.findTransactionObjects({
                addresses: [address],
                tags: ["BALANCE"]
            }, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    balance = getObjectPromise(data[data.length - 1].signatureMessageFragment).resolve;
                    resolve(balance);
                }
            })
        }
    )
}

 
API.prototype.getAddressAsync = async function getAddressAsync(supplierName) {
    let status = false;
    return new Promise(
        function (resolve, reject) {
            user.forEach(element => {
                if (element.Name == supplierName) {
                    status = true;
                    resolve(element.Address);
                }
            });
            if (!status) {
                reject(new Error("Supplier Name is not exist !!!"));
            }
        }
    )

}


API.prototype.getTxnAsync = async function getTxnAsync(balance) {
    var product = [];
    return new Promise(
        function (resolve, reject) {
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
                // console.log(product);
            })
        })
}