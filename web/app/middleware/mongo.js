const MongoClient = require('mongodb').MongoClient

module.exports = (app) => {
  return new Promise((resolve, reject) => {

    const CONFIG = require('../../config.json')
    
    const DB_USER = encodeURIComponent(CONFIG.db.userName)
    const DB_PASSWORD = encodeURIComponent(CONFIG.db.userPassword)
    const DB_AUTH = CONFIG.db.auth
    const DB_NAME = CONFIG.db.name
    const DB_HOST = CONFIG.db.host
    const DB_PORT = CONFIG.db.port
    const MONGO_URL = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/?authMechanism=${DB_AUTH}`

    MongoClient.connect(MONGO_URL, { useUnifiedTopology: true, useNewUrlParser: true }, (error, client) => {
      if (error) {
        return reject(error)
      }
      
      process.on('exit', () => {
        client.close()
      })

      const db = client.db(DB_NAME)
      resolve(db)
    })
  })
}
