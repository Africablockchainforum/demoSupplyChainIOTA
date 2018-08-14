const API = require("./api.js");
const api = new API();

// Init
var supplierName = "Supplier B"; // CHANGE NAME OF SELLER

// Prepare Transfers    
// Get receiver
var receiverName = "Supplier D"; //CHANGE NAME OF BUYER
// Get Products
var Products = [
    {
        "preHash": "HWLEWTQCMTQELJJ9BBNDKIH9IGXQLOQZOBYYMJRTBVONZUXQNYQHRHQJWBTPDIZYLVEMVZNVDREVPI999", // GET PREHASH BY function viewBalance
        "product": {
            "name": "Xoai", //CHANGE NAME
            "amount": 100 //CHANGE AMOUNT 
        }
    }
];


/*----------------------- DO NOT CHANGE ANY THING BELOW ------------------*/

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
    var checkBalance = true;    
    Products.forEach(pro => {
        let hash = pro.preHash;
        if(!!!balanceSeller.data[hash]){
            console.log(supplierName +" have no Product: "+pro.product.name+" !!!");
            checkBalance = false;;
        }
        try {            
            if (pro.product.amount > parseInt(balanceSeller.data[hash])) {
                console.log(supplierName +" is not enough Product !!!");
                checkBalance = false;;
            }
        } catch (error) {
            console.log("Error !!! Try again !!!");
            checkBalance = false;;
        }        
    });
    if(!checkBalance) {
        return;
    }
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
console.log("From "+supplierName+" To " + receiverName + ":")
console.log(Products);
main(supplierName,receiverName,Products);
