const CONFIG = require('../../config.json')

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
    constructor(database)
    {
        this.database = database

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

    inputUpdate(request)
    {
        return new Promise((resolve, reject) =>
        {
            const formidable = require('formidable')
            const form = new formidable.IncomingForm()

            form.parse(request, (err, fields, files) =>
            {
                const post = require('./PostStruct').formatPost(fields)

                if (fields._id === undefined)
                    reject('_id property is required')
                else if (files.file)
                    this.inputFile(files.file)
                        .then(({ content, thumb = null }) =>
                        {
                            post.content = Object.assign(post.content || {}, content)
                            post.thumb = Object.assign(post.thumb || {}, thumb)
                            resolve(post)
                        })
                        .catch(reject)
                else if (Object.keys(post).length > 1)
                    resolve(post)
                else
                    reject('Two properties minimum required')
            })
        })
    }

    createThumb(originalImage)
    {
        const path = require('path')
        const sharp = require('sharp')
        const sizeOf = require('image-size')
        const { getFilenameAvailable, mkDirForFile } = require('../utils/FileUtils')

        const { width, height } = sizeOf(originalImage)
        const pixels = width * height
        let thumbWidth, thumbHeight
        if (pixels > CONFIG.thumb.pixels)
        {
            const mult = Math.sqrt(CONFIG.thumb.pixels / pixels)
            thumbWidth = Math.round(width * mult)
            thumbHeight = Math.round(height * mult)
        }
        else
        {
            thumbWidth = width
            thumbHeight = height
        }
        
        let thumbName = originalImage.replace(CONFIG.upload.dir + '/' + CONFIG.upload.file, CONFIG.upload.dir + '/' + CONFIG.thumb.dir)
        thumbName = getFilenameAvailable(thumbName)
        mkDirForFile(thumbName)

        return new Promise((resolve, reject) =>
        {
            sharp(originalImage)
                .resize(thumbWidth, thumbHeight) // 512 * 1024 CONFIG.thumb.pixels
                .toFile(thumbName, (err, info) =>
                {
                    if (err)
                        return reject(err.message)

                    const thumb = {
                        type: 'image/' + info.format,
                        size: info.size,
                        path: path.relative(CONFIG.upload.dir, thumbName).split(path.sep).join('/'),
                        width: info.width,
                        height: info.height
                    }

                    resolve(thumb)
                })
        })
    }

    inputFile(file, { date = new Date() } = {})
    {
        return new Promise((resolve, reject) =>
        {
            const path = require('path')
            const { mvFile, isImage } = require('../utils/FileUtils')

            const year = date.getFullYear()
            const month = ('0' + (date.getMonth() + 1)).slice(-2)
            const { path: oldPath, size, name, type } = file
            const newPath = CONFIG.upload.dir + '/' + CONFIG.upload.file + '/' + year + '/' + month + '/' + name              
            const content = { name, type, size, path: newPath }

            mvFile(oldPath, newPath)
                .then(file =>
                {
                    content.path = path.relative(CONFIG.upload.dir, file).split(path.sep).join('/')

                    if (isImage(file))
                    {
                        this.createThumb(file)
                            .then(thumb => resolve({ content, thumb }))
                            .catch(reject)
                    }
                    else
                    {
                        resolve({ content })
                    }
                })
                .catch(reject)
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
                    if (files.file)
                        this.inputFile(files.file, { date: new Date(fields.date) })
                            .then(({ content, thumb = null }) =>
                            {
                                fields.content = Object.assign(fields.content || {}, content)
                                fields.thumb = Object.assign(fields.thumb || {}, thumb)
                                resolve(fields)
                            })
                            .catch(reject)
                    else
                        resolve(fields)
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

    insertPost(data, user)
    {
        return this.database.insert(COLLECTION_NAME, data)
    }

    updatePost(data, user)
    {
        const query = { _id: data._id }
        delete data._id

        if (data.content)
        {
            return this.getPost(query, user)
                .then(post => 
                {
                    if (post.thumb && post.thumb.path)
                    {
                        const deleted = this.deleteFile(CONFIG.upload.dir + '/' + post.thumb.path)
                        if (deleted !== true)
                            throw 'Error when delete thumb: ' + JSON.stringify(post.thumb) + ': ' + deleted
                    }
    
                    if (post.content && post.content.path)
                    {
                        const deleted = this.deleteFile(CONFIG.upload.dir + '/' + post.content.path)
                        if (deleted !== true)
                            throw 'Error when delete file: ' + JSON.stringify(post.content) + ': ' + deleted
                    }

                    return post      
                })
                .then(() => this.database.update(COLLECTION_NAME, query, data))
        }
        else
        {
            return this.database.update(COLLECTION_NAME, query, data)
        }
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
                        const deleted = this.deleteFile(CONFIG.upload.dir + '/' + post.thumb.path)
                        if (deleted !== true)
                            throw 'Error when delete thumb: ' + JSON.stringify(post.thumb) + ': ' + deleted
                    }
    
                    if (post.content && post.content.path)
                    {
                        const deleted = this.deleteFile(CONFIG.upload.dir + '/' + post.content.path)
                        if (deleted !== true)
                            throw 'Error when delete file: ' + JSON.stringify(post.content) + ': ' + deleted
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
