const IOTA = require("iota.lib.js");
const iota = new IOTA({
    provider: "https://nodes.testnet.iota.org:443"
    // provider: "https://nodes.devnet.thetangle.org:443"
});

const remoteCurl = require('@iota/curl-remote')
remoteCurl(iota, `https://powbox.testnet.iota.org`, 500)

const seed = 'HELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDD'

// iota.api.getNodeInfo((error, success) => {
//     if (error) {
//         console.log(error);

//     } else {
//         console.log(success);

//     }
// })

var msg = iota.utils.toTrytes("First Transfers in devtest")
var transfers = [
    {
        address: seed,
        value: 0,
        message: msg
    }
]

iota.api.sendTransfer(seed,3,9,transfers,(error,success)=>{
    if (error) {
        console.log(error);

    } else {
        console.log(success);

    }
})

// iota.api.getTransactionsObjects(["ZYF9BRHCRKNPSPNBLYJYIMWOQCVQ9NCKBBADFX9GOMZSPIFTJCZLSTCANDH9DWB99PIOQYQKMDFWOU999"], (error, success) => {
//     if (error) {
//         console.log(error);

//     } else {
//         console.log(success);

//     }
// })

