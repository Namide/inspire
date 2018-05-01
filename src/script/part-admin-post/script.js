import apiAdmin from '../utils/apiAdmin'
import * as Vibrant from 'node-vibrant'

const STATE = {
    INITIAL: 0,
    MODIFY: 1,
    MODIFIED: 2,
    UPDATE: 3,
    ERROR: 4
}

export default
{
    props:
    {
        post: { type: Object },
        insert: { type: Boolean, default: false }
    },

    data()
    {
        return {
            date: '',
            title: '',
            description: '',
            content_link: '',
            content_text: '',
            content_file: null,
            tags: [],
            types: [],
            public: true,

            state: STATE.INITIAL,
            fileImg: false,
            fileImgClampW: true
        } 
    },

    watch:
    {
        title: function(title)
        {
            this._modified.title = title
        },

        description: function(description)
        {
            this._modified.description = description
        },

        date: function(date)
        {
            this._modified.date = date.split('T').join(' ')
        },

        content_link: function(content_link)
        {
            this._modified.content_link = content_link
        },

        content_text: function(text)
        {
            this._modified.content_text = text
        },

        content_file: function(data)
        {
            this._modified.content_file = copy(data)
        },

        public: function(isPublic)
        {
            this._modified.public = isPublic
        },

        tags: function(tags)
        {
            this._modified.tags = copy(tags)
        },

        types: function(types)
        {
            this._modified.types = types
        }
    },

    created()
    {
        this.title = copy((this.post && this.post.title) || '')
        this.description = copy((this.post && this.post.description) || '')
        this.date = copy((this.post && this.post.date) || getToday()).split(' ').join('T')
        this.content_link = copy((this.post && this.post.content_link) || '')
        this.content_text = copy((this.post && this.post.content_text) || '')
        this.content_file = copy((this.post && this.post.content_file) || null)
        this.public = copy(this.post ? this.post.public : true)

        this.tags = copy((this.post && this.post.tags) || [])
        this.types = copy((this.post && this.post.types) || [])

        this._modified = { }
        if (!this.insert)
        {
            this._modified.uid = this.post && this.post.uid
        }

        if (this.content_file && this.content_file.width && this.content_file.height)
            this.fileImgClampW = +this.content_file.width > +this.content_file.height
    },

    methods:
    {
        save()
        {
            const data = this._modified

            if (this.insert)
            {
                apiAdmin.addPost(message =>
                {
                    console.log(message.data)
                }, data)
            }
            else
            {
                apiAdmin.updatePost(message =>
                {
                    console.log(message.data)
                }, data)
            }
        },

        filesChange([file])
        {
            this.types.push(...file.type.split('/'))
            this.content_file = {
                name: file.name,
                type: file.type,
                size: file.size
            }

            if (file.name && file.name !== '' && this.title == '')
            {
                const arr = file.name.split('.')
                arr.pop()

                this.title = arr.join(' ')
                    .split('_').join(' ')
                    .split('-').join(' ')
            }

            this._reader = new FileReader()
            this._reader.addEventListener('load', event =>
            {
                const result = event.target.result

                // Add base64
                {
                    const base64Arr = result.split(';base64,')
                    base64Arr.shift()
                    this._modified.base64 = base64Arr.join(';base64,')
                }

                // Add image data
                const isImage = file.type.split('/').shift().toLowerCase() === 'image'
                if (isImage)
                {
                    this.fileImg = result

                    var img = new Image()
                    img.addEventListener('load', event =>
                    {
                        this.$set(this.content_file, 'width', img.width)
                        this.$set(this.content_file, 'height', img.height)
                        this.fileImgClampW = img.width > img.height

                        extractColors(img, colors =>
                        {
                            this.$set(this.content_file, 'colors', colors)
                        }, error =>
                        {
                            console.error(error)
                        })
                    })

                    img.src = result
                }
                else
                {
                    console.log(this.content_file)
                }
            })

            this._reader.readAsDataURL(file)
        }
    }
}

const copy = obj => JSON.parse(JSON.stringify(obj))
const getToday = () => new Date(Date.now()).toJSON().split('.')[0]
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