const MongoClient = require('mongodb').MongoClient
const CONFIG = require('../../config.json')
// const MONGO_URL = "mongodb://root:password@localhost:27017/polyglot_ninja?authSource=admin";

const DB_USER = encodeURIComponent(CONFIG.db.userName)
const DB_PASSWORD = encodeURIComponent(CONFIG.db.userPassword)
const DB_AUTH = CONFIG.db.auth
const DB_NAME = CONFIG.db.name
const DB_HOST = CONFIG.db.host
const DB_PORT = CONFIG.db.port

const MONGO_URL = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/?authMechanism=${DB_AUTH}`

module.exports = (app) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(MONGO_URL, { useUnifiedTopology: true, useNewUrlParser: true }, (error, client) => {
      if (error) {
        return reject(error)
      }

      // assert.equal(null, err);

      const db = client.db(DB_NAME)

      // const users = db.collection('users');
      const items = db.collection('items')

      // app.users = users;
      app.items = items

      process.on('exit', () => {
        client.close()
      })

      resolve(db)
    })
  })
}
