const API = require("./api.js");
const api = new API();

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
            "amount": 5
        }
    }
];

/**
 * this function verify Products with buyer and send to network
 */
async function main(supplierName,receiverName,Products) {    
    //Verify Products
    // Get balance of Seller
    let sellerAdd = await api.getAddressAsync(supplierName);
    if(sellerAdd==null){
        console.log("Seller is not exsit !!!");
        return;
    }  
    let balanceSeller = await api.getBalanceAsync(sellerAdd);
    if(balanceSeller==null){
        console.log(supplierName +" have no Product !!!");
        return;
    }
    // Verify each Product with balance
    Products.forEach(pro => {
        let hash = pro.preHash;
        try {
            if (pro.amount > parseInt(balanceSeller.data[hash])) {
                console.log(supplierName +" is not enough Product !!!");
                return;
            }
        } catch (error) {
            console.log("Error !!! Try again !!!");
            return;
        }        
    });
    // confirm product
    let buyerAdd = await api.getAddressAsync(receiverName); 
    if(buyerAdd==null){
        console.log("Buyer is not exsit !!!");
        return;
    } 
    let responseData = await api.sendRequestAsync(buyerAdd);
    let status = responseData.status;
    if (status) {
        //send transfer             
        let seed = await api.getSeedAsync(supplierName); // seed must be save in local -- this is demo, so save in db.                 
        let balanceBuyer = await api.getBalanceAsync(buyerAdd);        
        if(balanceBuyer==null){
            balanceBuyer = {data: null,status:null};
            balanceBuyer.data={};    
            balanceBuyer.status;                    
        }
        let transfers = await api.pushToTransferAsync(seed, sellerAdd, buyerAdd, balanceSeller, Products, responseData.data);        
        let data = await api.sendTransferAsync(seed, buyerAdd, transfers, balanceBuyer, responseData.data); 
        if (data!==null) {
            // Alert messenger successful
            console.log("Sold Product Successful \n");            
        } else {
            // Alert messenger error
            console.log("Send Error !!!");
        }        
    }
    else{
        // Alert messenger error
        console.log("Send request is reject !!!");
    }           
}
console.log(Products);
main(supplierName,receiverName,Products);
