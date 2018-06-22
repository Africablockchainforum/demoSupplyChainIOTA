const IOTA = require('iota.lib.js')
const iota = new IOTA({
    provider: 'http://localhost:14700'
})

function API() {}                 

API.prototype.validateProduct = function(Product, callback){        
}

API.prototype.createTransfers = function(Product, callback){        
}

API.prototype.requestTransfers = function(Product, callback){        
}

API.prototype.sendTransfers = function(){    
    // create new Address
    // send init transfers
    // send Transfers 
}  
module.exports = API;