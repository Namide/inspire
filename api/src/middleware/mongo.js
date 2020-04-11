const MongoClient = require('mongodb').MongoClient;
const CONFIG = require('../../config.json')
// const MONGO_URL = "mongodb://root:password@localhost:27017/polyglot_ninja?authSource=admin";

const DB_USER = encodeURIComponent(CONFIG.db.userName);
const DB_PASSWORD = encodeURIComponent(CONFIG.db.userPassword);
const DB_AUTH = CONFIG.db.auth;
const DB_NAME = CONFIG.db.name;
const DB_HOST = CONFIG.db.host;
const DB_PORT = CONFIG.db.port;

// const MONGO_URL = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authMechanism=${DB_AUTH}`;
const MONGO_URL = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/?authMechanism=${DB_AUTH}`;
// const MONGO_URL = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

module.exports = function (app) {
  // MongoClient.connect('mongodb://zaedzead')
  //   .then(console.log)
  //   .catch(console.log)


  // MongoClient.connect(MONGO_URL, function(err, client) { // , { useUnifiedTopology: true, useNewUrlParser: true })
  //     console.log(client)
  //       app.people = client.collection("people");
  //       console.log("Database connection established")
  //   .catch((err) => console.error(err))

  MongoClient.connect(MONGO_URL, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, client) {
    // assert.equal(null, err);
    console.log("Mongo DB connect");
   
    const db = client.db(DB_NAME);
    app.users = db.collection('users');
    app.users.createIndex( { 'email': 1 }, { unique: true } );
   
    // client.close();
  });
};

// const mongoose = require('mongoose');

// module.exports = function (app) {
//   console.log(app)
//   mongoose.connect('mongodb://192.168.99.100:27017/test', {
//     useNewUrlParser: true,
//     // useUnifiedTopology: true
//   })
//     .then(console.log)
//     .catch(console.log)
// };
