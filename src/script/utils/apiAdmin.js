import config from '../../config'
import { Api } from './api'
import * as Vibrant from 'node-vibrant'

const dataToFormData = data =>
{
    const form = new FormData()
    for (const key of Object.keys(data))
    {
        const val = data[key]
        if (typeof val === typeof 'a' || typeof val === typeof 2)
            form.append(key, val)
        else if (Array.isArray(val))
            form.append(key, val.join(','))
        else
            form.append(key, JSON.stringify(val))
    }

    return form
}

class Post
{
    construct()
    {
        this.complete = false
        this.data = { }

        this._onError = []
        this._onComplete = []
    }

    addOnError(callback)
    {
        this._onError.push(callback)
    }

    removeOnError(callback)
    {
        const i = this._onError.indexOf(callback)
        if (i > -1)
            this._onError.splice(i, 1)
    }

    addOnComplete(callback)
    {
        this._onComplete.push(callback)
    }

    removeOnComplete(callback)
    {
        const i = this._onComplete.indexOf(callback)
        if (i > -1)
            this._onComplete.splice(i, 1)
    }

    addType(type)
    {
        if (!this.data.types)
            this.data.types = []
        
        if (!this.data.type.find(t => t.toLowerCase() === type.toLowerCase()))
            this.data.types.push(type)
    }

    addFile(file)
    {
        this.complete = false
        const types = file.type.split('/')
        types.forEach(type => this.addType(type))

        this.data.content_file = {
            name: file.name,
            type: file.type,
            size: file.size
        }

        if (file.name && file.name !== '' &&
            (!this.data.title || this.data.title === ''))
        {
            const arr = file.name.split('.')
            arr.pop()

            const title = arr.join(' ')
                .split('_').join(' ')
                .split('-').join(' ')

            this.data.title = title.substr(0,1).toUpperCase()
                + title.substr(1, title.length)
        }

        const reader = new FileReader()
        reader.addEventListener('load', event =>
        {
            const result = event.target.result

            // Add base64
            {
                const base64Arr = result.split(';base64,')
                base64Arr.shift()
                this.file = {
                    base64: base64Arr.join(';base64,')
                }
            }

            // Add image data
            const isImage = file.type.split('/').shift().toLowerCase() === 'image'
            if (isImage)
            {
                this.file.src = result

                var img = new Image()
                img.addEventListener('load', event =>
                {
                    this.data.content_file.width = img.width
                    this.data.content_file.height = img.height

                    // this.fileImgClampW = img.width > img.height

                    extractColors(img, colors =>
                    {
                        this.data.content_file.colors = colors
                        this.complete = true
                        this._onComplete.forEach(callback => callback(this))
                    }, error =>
                    {
                        this.complete = true
                        this._onError.forEach(callback => callback(this, error))
                    })
                })

                // img.src = result
            }
            else
            {
                this.complete = true
                this._onComplete.forEach(callback => callback(this))
            }
        })

        reader.readAsDataURL(file)
    }

    updateData()
    {
        if (this.complete)
        {
            
        }
        else
        {
            this._onComplete.push(() =>
            {
                this.updateData()
            })
        }
    }
}

class ApiAdmin extends Api
{
    constructor()
    {
        super()
    }

    createPost()
    {
        return new Post()
    }

    sendPost(post)
    {

    }

    addPost(onload, data)
    {
        const form = dataToFormData(data)
        const url = config.api.root + '/posts'
        const request = new Request(url)
        const params = {
            method: 'POST',
            headers: new Headers(),
            mode: 'cors',
            cache: 'default',
            body: form
        }

        fetch(request, params)
            // .then(collection => console.log(collection))
            .then(data => data.json())
            // .then(data => data.success ? (data.data.map(filterPost), data) : data)
            .then(json => onLoad(json))
    }

    updatePost(onload, data)
    {
        const newData = Object.assign({}, data)
        const url = config.api.root + '/posts/' + data.uid
        newData.uid = null
        const form = dataToFormData(newData)

        const request = new Request(url)
        const params = {
            method: 'POST',
            headers: new Headers(),
            mode: 'cors',
            cache: 'default',
            body: form
        }

        fetch(request, params)
            // .then(collection => console.log(collection))
            .then(data => data.json())
            // .then(data => data.success ? (data.data.map(filterPost), data) : data)
            .then(json => onLoad(json))
    }
}

const extractColors = (img, onColors, onError) =>
{
    const options = {
        // colorCount: number
        // quality: 2
        maxDimension: 1024
        // filters: Array<Filter>
        // ImageClass: ImageClass
        // quantizer: Quantizer
        // generator?: Generator
    }
    const vibrant = new Vibrant(img, options)
    vibrant.getPalette((err, palette) =>
    {
        const colors = []
        if (palette.LightVibrant)
            colors.push(palette.LightVibrant.getHex())
        if (palette.Vibrant)
            colors.push(palette.Vibrant.getHex())
        if (palette.DarkVibrant)
            colors.push(palette.DarkVibrant.getHex())
        if (palette.LightMuted)
            colors.push(palette.LightMuted.getHex())
        if (palette.Muted)
            colors.push(palette.Muted.getHex())
        if (palette.DarkMuted)
            colors.push(palette.DarkMuted.getHex())
        
        onColors(colors)

        if (err)
            onError(err)
    })
}

const apiAdmin = new ApiAdmin()

export default apiAdmin