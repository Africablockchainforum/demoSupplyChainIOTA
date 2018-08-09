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
async function main() {

    //check Product
        //get BuyerAdd and SellerAdd
        
    //send transfer

    let buyerAdd;
    let sellerAdd;
    let seed
    let newSellerAdd;
    let balanceSeller;
    let responseData;
    let transfers = [];
    let ArrTxnObj = [];
    buyerAdd = await api.getAddressAsync(receiverName);
    sellerAdd = await api.getAddressAsync(supplierName);
    seed = await api.getSeedAsync(supplierName);
    newSellerAdd = api.getNewAddress(seed);
    balanceSeller = await getBalanceAsync(sellerAdd);
    //check balance
    await sendRequestAsync(buyerAdd);
    ArrTxnObj = await pushToTransferAsync(sellerAdd, newSellerAdd, buyerAdd, balanceSeller, products, transfers, responseData);    
    await sendBalanceAsync(seed, ArrTxnObj);    
}

main();
