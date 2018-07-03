const API = require("./api.js")
const api = new API();

//Scan Transaction hash of product
var TransactionHash = "UWKNBVFPGBOEOTON9GXXJHRNUCOIEQQXQIPYUNVMYTWSNXDIRBS9LJXOQUIIWIUSNULPA9ZXAJZPGB999"

api.getSupply(TransactionHash, (error, history) => {
    if (error) {
        console.log(error);
    }
});



