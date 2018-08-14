const API = require("./api.js")
const api = new API();

//Scan Transaction hash of product
var TransactionHash = "HEUMBZLCKRQTBUOHLGGPEDNPJZMKQAFLZKKBBVOXFGZRTAAWBXVGAAEXUNLKVTGGXHZMQUYAPHSVVG999" //CHANGE IT

/*----------------------- DO NOT CHANGE ANY THING BELOW ------------------*/

api.getSupply(TransactionHash, (error) => {
    if (error) {
        console.log(error);
    }
});



