const MongoClient = require('mongodb').MongoClient;
const CONFIG = require('../../config.json')
// const MONGO_URL = "mongodb://root:password@localhost:27017/polyglot_ninja?authSource=admin";

const DB_USER = encodeURIComponent(CONFIG.db.userName);
const DB_PASSWORD = encodeURIComponent(CONFIG.db.userPassword);
const DB_AUTH = CONFIG.db.auth;
const DB_NAME = CONFIG.db.name;
const DB_HOST = CONFIG.db.host;
const DB_PORT = CONFIG.db.port;

const MONGO_URL = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/?authMechanism=${DB_AUTH}`;

module.exports = function (app) {
  
  MongoClient.connect(MONGO_URL, { useUnifiedTopology: true, useNewUrlParser: true }, function(error, client) {

    if (error) {
      console.log('DB error:', error.message)
    }

    // assert.equal(null, err);
    console.log("Mongo DB connect");
   
    const db = client.db(DB_NAME);
    app.users = db.collection('users');
    app.users.createIndex( { 'email': 1 }, { unique: true } );

    app.items = db.collection('items');

    app.groups = db.collection('groups');
    app.groups.createIndex( { 'filter': 1 }, { unique: true } );
   
    // client.close();
  });
};
