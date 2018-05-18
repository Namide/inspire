import api from '../utils/api'

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
            fileImg: false,
            fileImgClampW: true
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
        }
    },

    created()
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

        if (!this.insert)
        {
            this._modified.uid = this.post && this.post.uid
        }

        if (this.content_file && this.content_file.width && this.content_file.height)
            this.fileImgClampW = +this.content_file.width > +this.content_file.height

    },

    methods:
    {
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
                    this.state = STATE.INITIAL
                    if (data.success)
                        this.eventHub.$emit('post/add', data.data)
                }, data)
            }
            else
            {
                api.updatePost(data =>
                {
                    this.state = STATE.INITIAL
                    if (data.success)
                        this.eventHub.$emit('post/update', data.data)
                }, data)
            }
        },

        cancel()
        {
            this.state = STATE.INITIAL
        },

        edit()
        {
            this.state = STATE.MODIFY
        },

        getThumbSrc()
        {
            return api.getThumbURL(this.post.uid)
        },

        getFileSrc()
        {
            return api.geFileURL(this.post.uid)
        },

        thumbChange([file])
        {
            this._modified.thumb = file           
            this.state = STATE.MODIFY
        },

        filesChange([file])
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
