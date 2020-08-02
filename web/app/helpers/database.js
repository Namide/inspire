
module.exports.connect = ({ userName, userPassword, auth, name, host, port }) => {
  return new Promise((resolve, reject) => {
    const MongoClient = require('mongodb').MongoClient
    const userNameEncoded = encodeURIComponent(userName)
    const userPasswordEncoded = encodeURIComponent(userPassword)
    const mongoUrl = `mongodb://${userNameEncoded}:${userPasswordEncoded}@${host}:${port}/?authMechanism=${auth}`

    MongoClient.connect(mongoUrl, { useUnifiedTopology: true, useNewUrlParser: true }, (error, client) => {
      if (error) {
        return reject(error)
      }

      process.on('exit', () => {
        client.close()
      })

      const db = client.db(name)
      resolve({ db, client })
    })
  })
}
