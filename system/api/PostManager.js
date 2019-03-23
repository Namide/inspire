const COLLECTION_NAME = 'post'

const POST_TYPE = {
    FILE: 1,
    EMBED: 2,
    URL: 3,
    TEXT: 4
}


const IS_STRING = (val, min = 0, max = 128) => typeof val === typeof '' && val.length >= min && val.length < max
const IS_ARRAY = (val, min = 0, max = Infinity) => typeof val === typeof [] && val.length >= min && val.length <= max
const IS_NUMBER = (val, min = 0, max = Infinity) => typeof val === typeof 1 && !isNaN(val) && val >= min && val <= max
const IS_BOOLEAN = val => val === true || val === false
const IS_OBJECT = val => typeof val === typeof {}
// const IS_IMG = val => IS_OBJECT(val)
//     && IS_STRING(val.src)
//     && IS_NUMBER(val.width)
//     && IS_NUMBER(val.height)
//     && (!val.colors || IS_OBJECT(val.colors))

// const IS_IMG

const postIsValid = post =>
{
    for (const key in post)
    {
        const value = post[key]
        switch (key)
        {
            case 'title' :
                if (typeof value !== typeof '')
                    return 'Title must be a string'
                if (value.length > 128)
                    return 'Title can not exceed 128 characters'
                break
            case 'description' :
                if (typeof value !== typeof '')
                    return 'Description must be a string'
                if (value.length > 1024)
                    return 'Description can not exceed 1024 characters'
                break
            case 'tags' :
                if (typeof value !== typeof [])
                    return 'Tags must be an array'
                if (!value.reduce((a, b) => a && typeof b === typeof '', true))
                    return 'Every tags must be strings'
                break
            case 'date' :
                if (typeof value !== typeof 2)
                    return 'Date must be a number'
                if (value > -1 && value < Infinity)
                    return 'Date must be positive and finite'
                break
            case 'public' :
                if (value !== true && value !== false)
                    return 'Public must be a boolean'
                break
            case 'score' :
                if (typeof value !== typeof 2)
                    return 'Score must be a number'
                if (value >= 0 && value <= 10)
                    return 'Scrore must be between 0 and 10'
                break
            case 'thumb' :
                for (const key2 in value)
                {
                    const value2 = value[key2]
                    switch (key2)
                    {
                        case 'src' :
                            if (typeof value2 !== typeof '')
                                return 'Thumb.src must be a string'
                            if (value2.length > 1024)
                                return 'Thumb.src can not exceed 1024 characters'
                            break
                        case 'width' :
                            if (typeof value2 !== typeof 2)
                                return 'Width must be a number'
                            if (value2 > -1 && value2 < Infinity)
                                return 'Width must be positive and finite'
                            break
                        case 'height' :
                            if (typeof value2 !== typeof 2)
                                return 'Height must be a number'
                            if (value2 > -1 && value2 < Infinity)
                                return 'Height must be positive and finite'
                            break
                    }
                }
                break
            case 'content' :
                if (typeof value !== typeof {})
                    return 'Content must be an object'
                break
        }
    }

    return true
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
            title: val => IS_STRING(val, 128),
            description: val => IS_STRING(val, 1024),
            tags: val => IS_ARRAY(val),
            date: val => IS_NUMBER(val),
            thumb: IS_IMG,
            content: {
                type: POST_TYPE,    // 
                source: String,     // http://youtube.com/zerf
                raw: String,        // <iframe></iframe>
                data: Object        // { }
            },
            public: IS_BOOLEAN,
            score: val => IS_NUMBER(val, 0, 10)         // 0.0 - 10.0
        }
    }

    isValid(post)
    {
        return postIsValid(post)
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
