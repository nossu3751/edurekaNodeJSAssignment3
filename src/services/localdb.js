const fs = require('fs');

var readLocalDB = (filename)=> new Promise(
    (response, reject)=>{
        fs.readFile("./src/db/" + filename,(error,data)=>{
            if(error){
                console.log(error.stack);
                reject();
            }else{
                res.send(JSON.parse(data));
                response("Data retrieved");
            }
        })  
    }
)

module.exports = readLocalDB;