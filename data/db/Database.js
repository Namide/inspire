const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://docker:8081' // "mongodb://localhost:27017/mydb"

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.close();
});

export default class Database
{
    constructor()
    {

    }
}