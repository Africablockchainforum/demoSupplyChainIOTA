const LIB = require("./lib.js");
const api = new LIB();

// Init
var supplierName = "Farmer A0";

// Prepare Transfers    
// Get receiver
var receiverName = "Supplier B";
// Get Products
var Products = [
    {
        "preHash": "RNWPIOF9RCXRPLODGHAWGBFMJEMUEUWIDF9IOFEKCQTNHGZJWCFJGIRKYZITNDBFWQPZXVHGIDKVXY999",
        "product": {
            "name": "Cam",
            "amount": 1000
        }
    }
];

api.sellProduct(supplierName,receiverName,Products,(error,data)=>{
    Console.log(error,data);
})