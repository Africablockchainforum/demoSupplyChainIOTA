
const IOTA = require('iota.lib.js')
const iota = new IOTA({
    provider: "https://nodes.testnet.iota.org:443"
    // provider: "https://nodes.devnet.thetangle.org:443"
    // provider: 'http://localhost:14700'
})

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

// getObjectPromise("ODGASCPCHDPCGADBODGAACQBMBCBICUBOBSBCCXBRBMBRBGCFCKBICXBGCCBACZBUBXBYBCCBCVBSBGCWBUBUB9CKBDCACWBUBXBFCHCVBLBCBMBGC9CCBWBLBOBGCICPBDCQBMB9CVBLBLBICHCECBCRBGCCBZBECPBHCRBRBTBQBICCBCBCBGADBZAUAUAUAUAQAGAXBGCWBXBGCGCECLBNBTBDCVBVBFCHCZBUBTBKBXBFCNBBCKBCBNBVBCBDCCCKBECNBXBTBNBWBFCMBCCGCSBXBOBOBZBZBACGCICVBVBCBGCUBOB9CNBCCKBCCZBMBLBZBFCFCSBMBVBGCACFCBCFCICICMBCBCBCBGADBZAUAUAUAUAQDQAGAGDHDPCHDIDGDGADBHDFDIDTCQD999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999")
// .then(
//     function (obj) {
//         console.log(obj);
//     }
// )

iota.api.getNewAddress("QQDRXGYQFVROSIQAYCGRPHGDVDEEWXTBVVDLMBQA9HVAHQYVWEJHQQDPYKYAYFVOBKVQNAGOBKXHGIWAR", { total: 1, security: 1, index: 1 }, (error, response) => {
    if (error) {
        throw error;
    } else {
       console.log(response);
    }
})
