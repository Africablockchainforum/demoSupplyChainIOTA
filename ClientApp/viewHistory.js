const API = require("./api.js")
const api = new API();

//Scan Transaction hash of product
var TransactionHash = "MHGUBNSVBRLIOE9XCDBC9XI9LICC9ISNTEGHSIE9LKLXDPYGNFPIPQKQMMJITGLEEIRINBJRQBQWVI999"
api.getSupply(TransactionHash, (error, history) => {
    if (error) {
        console.log(error);
    }
});



