const IOTA = require('iota.lib.js')
const iota = new IOTA({
    provider: "https://nodes.testnet.iota.org:443"
    // provider: "https://nodes.devnet.thetangle.org:443"
    // provider: 'http://localhost:14700'
})
const depth = 3;
const minWeightMagnitude = 9;

var transfer = [];
var sellerAdd = "HZAWTFQFHRYDGKKDJXMKQMLTXJCEKYGYDSTFFHWLGLPWZBJNTZXIN9VRLZQBXJTDUMMISDBGZRRWTICD9";  // Farmer A1

var seed = "PXWCVWXGYLTXTCIRGDRBTLCUCP9SLWXVVGZWFDGGQUI9LBQOFOH9JZGETJAOTPHOGFJMEWAYDKYNGJDTQ"; //Farmer A1

var xoai = {
    "name": "Xoai",
            "amount": 60000
}
var cam = {
    "name": "Cam",
            "amount": 40000
}
var msgC = {
    "preHash": "root",
    "product": cam,
    "status": true
}
var msgX = {
    "preHash": "root",
    "product": xoai,
    "status": true
}

// transfer.push({
//     value: 0,
//     tag: "BUY",
//     address: sellerAdd,
//     message: iota.utils.toTrytes(JSON.stringify(msgC))
// })
// transfer.push({
//     value: 0,
//     tag: "BUY",
//     address: sellerAdd,
//     message: iota.utils.toTrytes(JSON.stringify(msgX))
// })

var bal={data:null,status:null};
bal.data={ JNQKQZQNBCXCOGPNLHPJWELQYCCVJFWU9V9INTRNVE9PXNHVJAKXVGNXRCEEDMTWWSBSQEFDPBUOTY999 :60000,
    LGBDYZ9LSIHNUKJ9DRWTK9LWXOWOLVWNNKXRDIVQODAIIMGE9UQYRGEZ9DQQBAJLNTXBRCPOTRWTSZ999: 40000};
bal.status =true;
transfer.push({
    value: 0,
    tag: "BALANCE",
    address: sellerAdd,
    message: iota.utils.toTrytes(JSON.stringify(bal))
})

iota.api.sendTransfer(seed,depth,minWeightMagnitude,transfer,(error,suc)=>{
    if(error){
        throw error;
    } else{
        console.log(suc);
    }
})
