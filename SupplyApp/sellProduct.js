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

// Validate Products and send transfer
api.sellProduct(supplierName, receiverName, Products, (err, status) => {
    if (err) {
        console.log(err);
    } else {
        console.log(status);
        
        if (status) {
            console.log("Print Bill processing ...");
        }
    }
});


