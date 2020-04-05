const MongoClient = require('mongodb').MongoClient;
// const MONGO_URL = "mongodb://root:password@localhost:27017/polyglot_ninja?authSource=admin";

const DB_USER = encodeURIComponent('damien');
const DB_PASSWORD = encodeURIComponent('password');
const DB_AUTH = 'DEFAULT';
const DB_NAME = 'inspire';
const DB_HOST = '192.168.99.100';
const DB_PORT = '27017';

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
    app.people = db.collection('people');
   
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
