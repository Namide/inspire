const COLLECTION_NAME = 'post'

const POST_TYPE = {
    FILE: 1,
    EMBED: 2,
    URL: 3,
    TEXT: 4
}

module.exports = class PostManager
{
    /**
     * 
     * @param {DataBase} database
     */
    constructor(database)
    {
        this.database = database

        this.skeleton = {
            title: String,
            description: String,
            tags: Array,
            date: Number,
            thumb: {
                src: String,
                width: Number,
                height: Number,
                colors: { }
            },
            content: {
                type: POST_TYPE,    // 
                source: String,     // http://youtube.com/zerf
                raw: String,        // <iframe></iframe>
                data: Object        // { }
            },
            public: Boolean,
            score: Number,          // 0.0 - 10.0
        }
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
