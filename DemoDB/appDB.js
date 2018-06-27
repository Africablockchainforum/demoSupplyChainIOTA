const IOTA = require('iota.lib.js')
const iota = new IOTA({ 
    provider: "https://nodes.devnet.thetangle.org:443"
    
 })

const remoteCurl = require('@iota/curl-remote')
remoteCurl(iota, `https://powbox.testnet.iota.org`, 500)

iota.api.getNodeInfo((error, success) => {
    if (error) {
        console.log(error)
    } else {
        console.log(success)
    }
})

const trytes =
    'HELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDD'

const message = iota.utils.toTrytes('Hello World!')

const transfers = [
    {
        value: 0,
        address: trytes,
        message: message
    }
]

iota.api.sendTransfer(trytes, 3, 9, transfers, (error, success) => {
    if (error) {
        console.log(error)
    } else {
        console.log(success)
    }
})