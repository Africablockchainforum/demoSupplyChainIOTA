const IOTA = require('iota.lib.js')
const iota = new IOTA({
    provider: "https://nodes.testnet.iota.org:443"
    // provider: "https://nodes.devnet.thetangle.org:443"
    // provider: 'http://localhost:14700'
})


var user = [
    {
        "Name": "Farmer A",
        "Seed": "CRTTXMWCNEPBNTAJFPP9ZBMZLNRDIGCTAYALRLNOFFRUUMUWDFRCBDGCVJVJ9DMODBIWXQASUUK9OERBF",
        "Address": "Z9VFFSZYU9KNJRDZVOOCFQUJELTFHRGTLSDYTQKAKQHUJMHDXMPODLVAJQGDVLRJEDOS9ZCDIJSATXAOD"
    },
    {
        "Name": "Supplier B",
        "Seed": "IRPDAMUOULBBQTZSYADCMOACCCXGCSDBXEGI9YXPAUPEYN9PIUCMWLBEGLFZDMMSSXYXKEKB9ACMGQWVE",
        "Address": "DAI9IABCADYZEKSIQTFKHUURLRG9ZCFSCVDWOUFACMWVMUGNYDRRTRLWQDMDJYYWGWUPYXABARXMKISRD"
    },
    {
        "Name": "User C",
        "Seed": "LQGLLEPYWLSMVHV9WQROAQOPOOAALASXCFXGQFWWLKXLPKATPEHGVFZ9J9VT9JX9QK9VHMIIBWHNGWPSJ",
        "Address": "SHMBACOMVTEGCA9XEJYTFJOVMRKPJKDFIFPIHEZZ9CBE9WQJOZTBFY9YHMVL9WYOXNDRWILDTWLIDGXXX"
    }
]

function API() { }
/**
 * 
 * @param {String trytes_encode} trytes 
 * @returns {String} message
 */
function toMessage(trytes) {
    temp = trytes.split("").reverse();
    var indexEnd = 0;
    for (let index = 0; index < temp.length; index++) {
        if (temp[index] != '9') {
            indexEnd = index;
            break;
        }
    }

    return iota.utils.fromTrytes(trytes.toString().substring(0, trytes.length - indexEnd));
}

/**
 * 
 * @param {String} address 
 * @param {function} callback 
 */
function getInforAddress(address, callback) {
    user.forEach(element => {
        if (element.Address.indexOf(address) >= 0) {
            console.log(element.Name);
        }
    });

}

/**
 * 
 * @param {Hash} transactionHash 
 * @param {Array} history 
 */
function getHistory(transactionHash, history) {
    let hashed = [transactionHash];
    iota.api.getTransactionsObjects(hashed, (error, txn) => {
        if (error) {
            console.log(error);
        } else {
            history.push(txn[0].address);
            getInforAddress(txn[0].address, (err, data) => {
                console.log(err, data);
            });
            let msg = JSON.parse(toMessage(txn[0].signatureMessageFragment));
            if (msg.preHash !== "") {
                history = getHistory(msg.preHash, history);
            }
        }
    })
    return history;
}

/**
 * 
 * @param {String} transactionHash 
 * @param {function} callback 
 */
API.prototype.getSupply = function (transactionHash, callback) {
    var history = [];
    let hashed = [transactionHash];
    iota.api.getTransactionsObjects(hashed, (error, txn) => {
        if (error) {
            return callback(error);
        } else {
            history.push(txn[0].address);
            getInforAddress(txn[0].address, (err, data) => {
                console.log(err, data);
            });
            let msg = JSON.parse(toMessage(txn[0].signatureMessageFragment));
            history = getHistory(msg.preHash, history);
        }
    })
    return callback(null, history);
}

module.exports = API;