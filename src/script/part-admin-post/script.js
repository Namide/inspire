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
        
    },

    methods:
    {
        filesChange([file])
        {
            this.type = file.type
            this._file = {
                name: file.name,
                type: file.type,
                size: file.size
            }

            this._reader = new FileReader()
            this._reader.addEventListener('load', event =>
            {
                const result = event.target.result
                
                // Add base64
                const a = result.split(';base64,')
                a.shift()
                this._file.base64 = a.join(';base64,')
                
                // Add image data
                const isImage = file.type.split('/').shift().toLowerCase() === 'image'
                if (isImage)
                {
                    this.fileImg = result

                    var img = new Image()
                    img.addEventListener('load', event =>
                    {
                        this._file.width = img.width
                        this._file.height = img.height

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
                            
                            this._file.colors = colors
                            console.log(this._file)
                        })
                    })

                    img.src = result
                }
                else
                {
                    console.log(this._file)
                }
            })

            this._reader.readAsDataURL(file)
        }
    }
}