const COLLECTION_NAME = 'post'

module.exports = class PostManager
{
    /**
     * 
     * @param {DataBase} database 
     * @param {User} user 
     */
    constructor(database)
    {
        this.database = database
    }

    insertPost(content, user)
    {
        return this.database.insert(COLLECTION_NAME, content)
    }

    updatePost(query, content, user)
    {
        return this.database.update(COLLECTION_NAME, query, content)
    }

    deletePost(query, user)
    {
        return this.database.delete(COLLECTION_NAME, query)
    }

    getPosts(query, user)
    {
        return this.database.find(COLLECTION_NAME, query)
    }

    getPost(query, user)
    {
        return this.database.findOne(COLLECTION_NAME, query)
    }
}
