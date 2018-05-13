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
                api.addPost(message =>
                {
                    console.log(message.data)
                }, data)
            }
            else
            {
                api.updatePost(message =>
                {
                    console.log(message.data)
                }, data)
            }
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
        }
    }
}

const copy = obj => JSON.parse(JSON.stringify(obj))
const getToday = () => new Date(Date.now()).toJSON().split('.')[0]
