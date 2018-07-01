const API = require ("./api.js")
const api = new API();
const READLINE = require('readline');
const readline = READLINE.createInterface({
    input: process.stdin,
    output: process.stdout
});

//Scan Transaction hash of product
readline.question("Enter your Transaction Hash: ", (TransactionHash) => {    
    api.getSupply(TransactionHash, (error, history)=>{
        if(error){
            console.log(error);        
        }else{
            history.forEach(element => {
                api.getInforAddress(element,(error,infor)=>{
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(infor);                   
                    }
                });
            });
        }
    });
});



