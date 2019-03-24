const MongoClient = require('mongodb').MongoClient

class DataBase
{
    constructor(db)
    {
        this.db = db
    }

    insert(collectionName, content, options = {})
    {
        return this.db.collection(collectionName).insertOne(content)
    }

    update(collectionName, query, content, options = {})
    {
        return this.db.collection(collectionName).updateOne(query, { $set: content })
    }

    find(collectionName, query, options = {})
    {
        return this.db.collection(collectionName).find(query).toArray()
    }

    findOne(collectionName, query, options = {})
    {
        return this.db.collection(collectionName).findOne(query, options)
    }

    delete(collectionName, query, options = {})
    {
        return this.db.collection(collectionName).deleteOne(query)
    }

    close()
    {
        this.db.close()
    }
}

module.exports = getDataBase = ({ host = 'localhost', port = 27017, name = 'inspire' } = {}) =>
{
    const url = 'mongodb://' + host + ':' + port
    return MongoClient.connect(url, { useNewUrlParser: true })
        .then(db =>
        {
            console.log('Database connected ' + url + ' name: ' + name)
            return new DataBase(db.db(name))
        })
}
