const API = require("./api.js")
const api = new API();

//Scan Transaction hash of product
var TransactionHash = "MHGUBNSVBRLIOE9XCDBC9XI9LICC9ISNTEGHSIE9LKLXDPYGNFPIPQKQMMJITGLEEIRINBJRQBQWVI999" //CHANGE IT


api.getSupply(TransactionHash, (error) => {
    if (error) {
        console.log(error);
    }
});



