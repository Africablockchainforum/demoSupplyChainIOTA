const API = require ("./api.js")
const api = new API();

//Scan Transaction hash of product
var TransactionHash = "X9LYTWNTGTUGSARAMAKPSRLKGQMIWCWYEFQRRGOOJYITW9FNAH9PNHHY9GNDJIRKQJSEUESYZLHZXL999";

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

