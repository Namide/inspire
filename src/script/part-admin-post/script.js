import api from '../utils/api'
import PartAdminFileLoader from '../part-admin-file-loader'

const STATE = {
    INITIAL: 0,
    MODIFY: 1,
    MODIFIED: 2,
    UPDATE: 3,
    ERROR: 4
}

export default
{
    components:
    {
        PartAdminFileLoader
    },

    props:
    {
        post: { type: Object },
        insert: { type: Boolean, default: false }
    },

    data()
    {
        return {
            title: null,
            description: null,
            thumb: null,
            date: null,
            content_link: null,
            content_text: null,
            content_file: null,
            tags: null,
            types: null,
            public: null,

            state: STATE.INITIAL,
        } 
    },

    watch:
    {
        title: function(title, before)
        {
            if (before !== null)
            {
                this.state = STATE.MODIFY
                this._modified.title = title
            }
        },

        description: function(description, before)
        {
            if (before !== null)
            {
                this._modified.description = description
                this.state = STATE.MODIFY
            }
        },

        thumb: function(data, before)
        {
            if (before !== null)
            {
                this.state = STATE.MODIFY
                this._modified.thumb = copy(data)
            }
        },

        date: function(date, before)
        {
            if (before !== null)
            {
                this._modified.date = date.split('T').join(' ')
                this.state = STATE.MODIFY
            }
        },

        content_link: function(content_link, before)
        {
            if (before !== null)
            {
                this._modified.content_link = content_link
                this.state = STATE.MODIFY
            }
        },

        content_text: function(text, before)
        {
            if (before !== null)
            {
                this.state = STATE.MODIFY
                this._modified.content_text = text
            }
        },

        content_file: function(data, before)
        {
            if (before !== null)
            {
                this.state = STATE.MODIFY
                this._modified.content_file = copy(data)
            }
        },

        public: function(isPublic, before)
        {
            if (before !== null)
            {
                this.state = STATE.MODIFY
                this._modified.public = isPublic
            }
        },

        tags: function(tags, before)
        {
            if (before !== null)
            {
                this.state = STATE.MODIFY
                this._modified.tags = copy(tags)
            }
        },

        types: function(types, before)
        {
            if (before !== null)
            {
                this.state = STATE.MODIFY
                this._modified.types = types
            }
        },

        state: function (state)
        {
            window.removeEventListener('keyup', this.close)

            if (state !== STATE.INITIAL)
                window.addEventListener('keyup', this.close)
        }
    },

    created()
    {
        this.init()

        if (!this.insert)
            this._modified.uid = this.post && this.post.uid
    },

    methods:
    {
        init()
        {
            this._modified = { }

            this.title = copy((this.post && this.post.title) || '')
            this.description = copy((this.post && this.post.description) || '')
            this.thumb = copy((this.post && this.post.thumb) || null)
            this.date = copy((this.post && this.post.date) || getToday()).split(' ').join('T')
            this.content_link = copy((this.post && this.post.content_link) || '')
            this.content_text = copy((this.post && this.post.content_text) || '')
            this.content_file = copy((this.post && this.post.content_file) || null)
            this.public = this.post ? !!this.post.public : true
    
            this.tags = copy((this.post && this.post.tags) || [])
            this.types = copy((this.post && this.post.types) || [])
        },

        deletePost()
        {
            this.state = STATE.MODIFY
            api.deletePost(data =>
            {
                this.state = STATE.INITIAL
                if (data.success)
                    this.eventHub.$emit('post/delete', data.data.uid)
            }, this.post.uid)
        },

        save()
        {
            const data = this._modified

            if (this.insert)
            {
                api.addPost(data =>
                {
                    if (data.success)
                        this.eventHub.$emit('post/add', data.data)
                }, data)
                this.state = STATE.INITIAL
            }
            else
            {
                api.updatePost(data =>
                {
                    
                    if (data.success)
                        this.eventHub.$emit('post/update', data.data)
                }, data)
                this.state = STATE.INITIAL
            }
        },

        close()
        {
            this.state = STATE.INITIAL
        },

        cancel()
        {
            this.init()
            this.$nextTick(this.close)
        },

        edit()
        {
            this.state = STATE.MODIFY
        },

        getThumbSrc()
        {
            return this.post ? api.getThumbURL(this.post.uid) : ''
        },

        getFileSrc()
        {
            return this.post ? api.getFileURL(this.post.uid) : ''
        },

        thumbChange(file)
        {
            this._modified.thumb = file           
            this.state = STATE.MODIFY
        },

        linkChange()
        {
            if (this.title == '')
            {
                api.getDistantLink(data =>
                {
                    const distantPage = document.implementation.createHTMLDocument('')
                    distantPage.open()
                    distantPage.write(data.data)
                    distantPage.close()

                    if (distantPage.title != '' && this.title == '')
                        this.title = distantPage.title

                    const image = distantPage.querySelector('meta[property="og:image"]')
                    const images = distantPage.querySelectorAll('a[href]')
                    if (image)
                    {
                        const URL = image.getAttribute('content')
                    }
                    else if (images.length > 0)
                    {
                        const URL = images[0].getAttribute('src')
                    }

                }, this.content_link)
            }
        },

        fileChange(file)
        {
            this._modified.content_file = file

            const types = file.type ? file.type.split('/') : []
            if (types.length > 0 && this.types.indexOf(types[0]) < 0)
                this.types.push(types[0])

            if (file.name && file.name !== '' && this.title == '')
            {
                const arr = file.name.trim().split('.')
                arr.pop()

                const title = arr.join(' ')
                    .split('_').join(' ')
                    .split('-').join(' ')
                
                if (title.length > 0)
                    this.title = title.charAt(0).toUpperCase() + title.slice(1)
            }
            
            this.state = STATE.MODIFY
        }
    }
}

const copy = obj => JSON.parse(JSON.stringify(obj))
const getToday = () => new Date(Date.now()).toJSON().split('.')[0]
