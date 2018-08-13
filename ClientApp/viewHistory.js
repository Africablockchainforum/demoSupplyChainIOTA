const API = require("./api.js")
const api = new API();

//Scan Transaction hash of product
// var TransactionHash = "RNWPIOF9RCXRPLODGHAWGBFMJEMUEUWIDF9IOFEKCQTNHGZJWCFJGIRKYZITNDBFWQPZXVHGIDKVXY999"
var TransactionHash = "RMQRQNITY9KPB9HVELKFXYDBQTUNPCAEJAHNENPHVSTVMJ9RCDD9ODM9DPROALPFGXSJ9NBDADWIHN999"
api.getSupply(TransactionHash, (error, history) => {
    if (error) {
        console.log(error);
    }
});



