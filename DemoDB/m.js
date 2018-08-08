const fs = require("fs");
const readFile = fs.readFile;

function readFilePromisified(filename) {
    return new Promise(
        function (resolve, reject) {
            readFile(filename, { encoding: 'utf8' },
                (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });
}


readFilePromisified("db.json")
.then(text => {
    var user = JSON.parse(text);
    user.forEach(element => {
        console.log(element);        
    });
    console.log("AAAAAAAAAAAAa");
    
})
.catch(error => {
    console.log(error);
});