const COLLECTION_NAME = 'post'

const POST_TYPE = {
    FILE: 1,
    EMBED: 2,
    URL: 3,
    TEXT: 4
}

/*
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
*/


// const IS_IMG

module.exports = class PostManager
{
    /**
     * 
     * @param {DataBase} database
     */
    constructor(database, uploadDir)
    {
        this.database = database
        this.uploadDir = uploadDir

        /*this.skeleton = {
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
        }*/
    }

    inputDelete(request)
    {
        return new Promise((resolve, reject) =>
        {
            const formidable = require('formidable')
            const form = new formidable.IncomingForm()

            form.parse(request, (err, fields, files) =>
            {
                const post = require('./PostStruct').formatPost(fields)

                if (Object.keys(post).length > 0)
                    resolve(post)
                else
                    reject('One property minimum required')
            })
        })
    }

    inputPost(request)
    {
        return new Promise((resolve, reject) =>
        {
            const formidable = require('formidable')
            const form = new formidable.IncomingForm()
    
            form.parse(request, (err, fields, files) =>
            {
                fields.date = fields.date || Date.now()

                if (fields.tags)
                    fields.tags = fields.tags.split(',')
    
                const isPostValid = require('./PostStruct').postIsValid(fields)
                if (isPostValid === true)
                {
                    const file = files.file
                    if (file)
                    {
                        const date = new Date(fields.date)
                        const year = date.getFullYear()
                        const month = ('0' + (date.getMonth() + 1)).slice(-2)
        
                        const { path: oldPath, size, name, type } = file
                        const { mvFile } = require('../utils/FileUtils')
                        const newPath = this.uploadDir + '/' + year + '/' + month + '/' + name

                        if (!fields.content)
                            fields.content = {}
                        
                        fields.content.data = Object.assign({ name, type, size, path: newPath }, fields.content.data || {})

                        mvFile(oldPath, newPath)
                            .then(file =>
                            {
                                const path = require('path')
                                fields.content.data.path = path.relative(this.uploadDir, file).split(path.sep).join('/')
                                resolve(fields)
                            })
                            .catch(reject)
                    }
                    else
                    {
                        if (err)
                            reject(err.message)
                        else
                        {
                            resolve(fields)
                        }
                    }

                    // server.setContentType('.json')
                    // const post = postManager.insertPost(postData)
                    //     .then(() => server.serveStr(JSON.stringify(fields)))
                    //     .catch(err => server.serveError(err))
                }
                else
                {
                    reject(isPostValid)
                }
            })
        })
    }

    deleteFile(path)
    {
        try
        {
            require('fs').unlinkSync(path)
            return true
        }
        catch (err)
        {
            return err.message
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

    deletePosts(query, user)
    {
        return this.getPosts(query, user)
            .then(posts => 
            {
                posts.forEach(post =>
                {
                    if (post.thumb && post.thumb.path)
                    {
                        const deleted = this.deleteFile(this.uploadDir + '/' + post.thumb.path)
                        if (deleted !== true)
                            throw 'Error when delete the thumb: ' + JSON.stringify(post.thumb) + ': ' + deleted
                    }
    
                    if (post.content && post.content.data && post.content.data.path)
                    {
                        const deleted = this.deleteFile(this.uploadDir + '/' + post.content.data.path)
                        if (deleted !== true)
                            throw 'Error when delete the file: ' + JSON.stringify(post.content) + ': ' + deleted
                    }
                })

                return posts      
            })
            .then(() => this.database.delete(COLLECTION_NAME, query))
    }

    getPosts(query, user)
    {
        return this.database.find(COLLECTION_NAME, query)
    }

    getPost(query, user)
    {
        return this.database.findOne(COLLECTION_NAME, query)
    }

    getLastPost(user)
    {
        return this.database.findOne(COLLECTION_NAME, {}, { sort: { _id: -1 }})
    }
}