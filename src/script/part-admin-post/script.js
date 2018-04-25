import api from '../utils/api'
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
    },

    data()
    {
        return {
            date: '',
            title: '',
            type: '',
            description: '',
            content_link: '',
            content_text: '',
            public: true,

            state: STATE.INITIAL,
            fileImg: false,
        } 
    },

    created()
    {
        this.date = JSON.parse(JSON.stringify(this.post.date || '')).split(' ').join('T')
        this.title = JSON.parse(JSON.stringify(this.post.title || ''))
        this.description = JSON.parse(JSON.stringify(this.post.description || ''))
        this.content_link = JSON.parse(JSON.stringify(this.post.content_link || ''))
        this.content_text = JSON.parse(JSON.stringify(this.post.content_text || ''))
        this.content_file = JSON.parse(JSON.stringify(JSON.parse(this.post.content_file) || {}))
        this.public = JSON.parse(JSON.stringify(this.post.public))
        // this.content_file
    },

    methods:
    {
        save()
        {
            const data = {
                date: this.date,
                title: this.title,
                description: this.description,
                content_link: this.content_link,
                content_text: this.content_text,
                public: this.public,
            }

            if (this.base64 && this.content_file && this.content_file.name)
            {
                data.base64 = this.base64
                data.content_file = JSON.stringify(this.content_file)
            }

            api.addPost(message =>
                {
                    if (message.data && message.data.content_file)
                        message.data.content_file = JSON.parse(message.data.content_file)

                    console.log(message.data.content_file)
                }, data)
        },

        filesChange([file])
        {
            this.type = file.type
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
                const a = result.split(';base64,')
                a.shift()
                this.base64 = a.join(';base64,')

                // Add image data
                const isImage = file.type.split('/').shift().toLowerCase() === 'image'
                if (isImage)
                {
                    this.fileImg = result

                    var img = new Image()
                    img.addEventListener('load', event =>
                    {
                        this.content_file.width = img.width
                        this.content_file.height = img.height

                        Vibrant.from(img).getPalette((err, palette) =>
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
                            
                            this.content_file.colors = colors
                            console.log(this.content_file)
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