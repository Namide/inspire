import api from '../utils/api'
// import api from '../utils/api'
import PartAdminFileLoader from '../part-admin-file-loader'
import SetPostContent from '../utils/SetPostContent'
import PartContent from '../part-content'
import PartInputTextarea from '../part-input-textarea'

export default
{
    components:
    {
        PartAdminFileLoader,
        PartContent,
        PartInputTextarea
    },

    props:
    {
        post: { type: Object },
        insert: { type: Boolean, default: false }
    },

    data()
    {
        return {
            isFile: false,

            title: null,
            description: null,
            thumb: null,
            date: null,
            content: null,
            content_format: [],
            contentRaw: null,
            tags: [],
            types: [],
            public: null,

            state: 0
        } 
    },

    watch:
    {
        title(title, before)
        {
            if (before !== null)
            {
                this._modified.title = title
            }
        },

        description(description, before)
        {
            if (before !== null)
            {
                this._modified.description = description
            }
        },

        thumb(data, before)
        {
            if (before !== null)
            {
                // this._modified.thumb = copy(data)
            }
        },

        date(date, before)
        {
            if (before !== null)
            {
                this._modified.date = date.split('T').join(' ')
            }
        },

        contentRaw(text)
        {
            if (text !== null)
            {
                const content = SetPostContent.extractContent(text)
                const format = SetPostContent.extractFormat(content)
                this._modified.content = content
                this._modified.content_format = format
                this.content = content
                this.content_format = format
                
                // console.log('content formated:', content)
            }
        },

        /*content_file(data, before)
        {
            if (before !== null)
            {
                this.state = STATE.MODIFY
                // this._modified.content_file = copy(data)
            }
        },*/

        public(isPublic, before)
        {
            if (before !== null)
            {
                this._modified.public = isPublic
            }
        },

        tags(tags, before)
        {
            if (before !== null)
            {
                this._modified.tags = copy(tags)
            }
        },

        types(types, before)
        {
            if (before !== null)
            {
                this._modified.types = types
            }
        },

        // state(state)
        // {
            

        //     if (state !== STATE.INITIAL) {
        //         window.addEventListener('keyup', this.keyUp)
        //         window.addEventListener('resize', this.resizeContentRaw)
        //         this.resizeContentRaw()
        //     }
        // }
    },

    created()
    {
        window.removeEventListener('keyup', this.keyUp)

        this.init()

        if (!this.insert)
        {
            this._modified.uid = this.post && this.post.uid
            this.state = 1
        }
    },

    destroyed()
    {
        window.removeEventListener('keyup', this.keyUp)
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
            this.content_format = copy((this.post && this.post.content_format) || [])
            this.content = copy((this.post && this.post.content) || null)
            this.contentRaw = this.post && this.post.content && this.post.content.raw ? copy(this.post.content.raw) : null
            this.public = this.post ? !!this.post.public : true
    
            this.tags = copy((this.post && this.post.tags) || [])
            this.types = copy((this.post && this.post.types) || [])
        },

        validContent()
        {
            if (this.content && this.content.url)
            {
                this.updateByLink(this.content.url, () => this.state++)
            }
            else 
            {
                this.state++
            }
        },

        deletePost()
        {
            this.$store.dispatch('deletePost', {uid: this.post.uid})
            /*api.deletePost(data =>
            {
                if (data.success)
                    this.$store.commit('deletePost', data.data.uid)
                
                this.cancel()
            }, this.post.uid)*/
        },

        save()
        {
            const data = this._modified
            console.log(data, this.insert)

            if (this.insert)
            {
                this.$store.dispatch('addPost', {post: data})
                /*api.addPost(data =>
                {
                    if (data.success)
                        this.$store.commit('addPost', data.data)
        
                }, data)*/
                this.cancel()
            }
            else
            {
                this.$store.dispatch('updatePost', {uid: this.post.uid, data: data})
                /*api.updatePost(data =>
                {
                    if (data.success)
                        this.$store.commit('updatePost', data.data)
                
                }, this.post.uid, data)*/
                this.cancel()
            }
        },

        close()
        {
            this.$emit('close')
        },

        cancel()
        {
            // this.init()
            // this.$nextTick(this.close)
            this.close()
        },

        // edit()
        // {
        //     this.state = STATE.MODIFY
        // },

        getThumbSrc()
        {
            return this.post && this.thumb ? api.getThumbURL(this.post.uid) : ''
        },

        getFileSrc()
        {
            return this.post
                   && this.content_format
                   && this.content_format.indexOf('file') > -1
                   && this.content_format.indexOf('image') > -1
                   && this.content
                   ? api.getFileURL(this.post.uid) : ''
        },

        keyUp(keyEvent)
        {
            if (keyEvent.keyCode === 27)
                this.close()
        },

        updateByLink(URL, callback)
        {
            api.getDistantLink(data =>
            {
                const distantPage = document.implementation.createHTMLDocument('')
                distantPage.open()
                distantPage.write(data.data)
                distantPage.close()

                if (distantPage.title != '' && this.title == '')
                    this.title = distantPage.title

                const description = distantPage.querySelector('meta[name="description"]')
                if (description && description.content !== '')
                {
                    this.description = description.content
                }

                const image = distantPage.querySelector('meta[property="og:image"]')
                const images = distantPage.querySelectorAll('a[href]')
                if (image)
                {
                    const URL = image.getAttribute('content')
                    console.log(URL)
                }
                else if (images.length > 0)
                {
                    const URL = images[0].getAttribute('src')
                    console.log(URL)
                }

                callback()

            }, URL, callback)
        },

        thumbChange(file)
        {
            if (!file)
            {
                this.thumb = null
                this._modified.thumb = null
                return
            }

            const thumb = {
                name: file.name,
                size: file.size,
                type: file.type
            }

            this.thumb = thumb
            this._modified.thumb = file
        },

        fileChange(file)
        {
            if (!file)
            {
                this.content = null
                this.content_format = []
                this._modified.file = null
                this._modified.content = null
                this._modified.content_format = []
                return
            }

            const content_format = ['file', ...file.type.split('/').map(type => type.toLowerCase())]
            const content = {
                name: file.name,
                size: file.size,
                type: file.type
            }

            this.content_format = copy(content_format)
            this.content = copy(content)
            this._modified.content_format = content_format
            this._modified.content = content
            this._modified.file = file

            
            // this.file = file
            // this._modified.content_file = file

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
