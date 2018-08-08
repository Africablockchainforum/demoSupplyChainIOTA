const IOTA = require("iota.lib.js");
const iota = new IOTA({
    provider: "https://nodes.testnet.iota.org:443"
    // provider: "https://nodes.devnet.thetangle.org:443"
    // provider: 'http://localhost:14700'

});
const fs = require("fs")
// const synchr = require("synchronize");
var seed = "MGZWCDTSBDJBVXXMXQWEDOIWIPLJIPAZPCZFTTLFHWAFTOKCONJGWURMS9UMHPHJYYIYAZAKXZFGYZXDA"

// iota.api.getNewAddress(seed, { total: 1, security: 1, index: 1 }, (error, response) => {
//     if (error) {
//         console.log(error);

//     } else {
//         addressInit = response;
//         console.log(response);

//     }

// })


// function a() {
//     let a = 0;
  
//     for (i = 0; i < 100000000; i++) {
//       a++;
//     }
//     let data2;
//     fs.readFile("E:\\Study and Job\\Job\\VietIS\\BlockChain\\SupplyChain\\demoSupplyChainIOTA\\db.json",(err,data)=>{
//         data2 = data;
//     });
    
//   }
  
//   function b() {
//     let a = 0;
//     let data2;
//     fs.readFile("E:\\Study and Job\\Job\\VietIS\\BlockChain\\SupplyChain\\demoSupplyChainIOTA\\db.json",(err,data)=>{
//         data2 = data;
//     });
//     for (i = 0; i < 100000000; i++) {
//       a++;
//     }
    
//   }
  
//   function c() {
    
//     console.log('sync finished!');
//   }
  
//   a();
//   b();
//   c();
//   console.log('This should be good');

