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
/**
 * method get sender seed from console and validate
 * @param {function} callback 
 * @returns {String} Seed of supplier Name
 */
async function getSeedPromise(supplierName) {
    return new Promise(
        function (resolve, reject) {
            let status = false;
            user.forEach(element => {
                if (element.Name == supplierName) {
                    status = true;
                    resolve(element.Seed)
                }
            });
            if (!status) {
                reject(null);
            }
        });
}
/**
 * method get receiver address from console and validate
 * @param {function} callback 
 * @returns {String} Address of supplier Name
 */
async function getAddressPromise(supplierName) {
    return new Promise(
        function (resolve, reject) {
            let status = false;
            user.forEach(element => {
                if (element.Name == supplierName) {
                    status = true;
                    resolve (element.Address)
                }
            });
            if (!status) {
                reject(null);
            }
        });
}