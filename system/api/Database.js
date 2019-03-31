const MongoDB = require('mongodb')
const MongoClient = MongoDB.MongoClient

class DataBase
{
    constructor(db)
    {
        this.db = db
    }

    insert(collectionName, content, options = {})
    {
        return new Promise((resolve, reject) =>
        {
            this.db.collection(collectionName).insertOne(content, (error, results) =>
            {
                if (error)
                    reject(error.message)
                else if (results.insertedCount < 1)
                    reject('Element not saved')
                else
                    resolve(this.findOne(collectionName, { _id: results.insertedId }))
            })
        })
    }

    update(collectionName, query, content, options = {})
    {
        if (query._id)
            query._id = new MongoDB.ObjectID(query._id)

        return new Promise((resolve, reject) =>
        {
            this.db.collection(collectionName).updateOne(query, { $set: content }, (error, results) =>
            {
                if (error)
                    reject(error.message)
                else if (results.modifiedCount === 0)
                    reject('Element not modified')
                else
                    resolve(this.findOne(collectionName, query))
            })
        })
    }

    find(collectionName, query, options = {})
    {
        return new Promise((resolve, reject) =>
        {
            this.db.collection(collectionName).find(query, (error, results) =>
            {
                if (error)
                    reject(error.message)
                else
                    results.toArray()
                        .then(list => resolve(list))
                        .catch(error => reject(error))
            })
        })
    }

    findOne(collectionName, query, options = {})
    {
        if (query._id)
            query._id = new MongoDB.ObjectID(query._id)

        return new Promise((resolve, reject) =>
        {
            this.db.collection(collectionName).findOne(query, (error, results) =>
            {
                if (error)
                    reject(error.message)
                else
                    resolve(results)
            })
        })
    }

    delete(collectionName, query, options = {})
    {
        if (query._id)
            query._id = new MongoDB.ObjectID(query._id)

        return new Promise((resolve, reject) =>
        {
            this.db.collection(collectionName).deleteMany(query, (error, results) =>
            {
                if (error)
                    reject(error.message)
                else if (results.deletedCount < 1)
                    reject('Element not deleted because not found')
                else
                    resolve({ success: true, message: results.deletedCount + ' element' + (results.deletedCount > 1 ? 's' : '') + ' deleted' })
            })
        })
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
