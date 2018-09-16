import apiSet from '../utils/apiSet'
import apiGet from '../utils/apiGet'
import PartAdminFileLoader from '../part-admin-file-loader'
import SetPostContent from '../utils/SetPostContent'
import PartContent from '../part-content'

const STATE = {
    INITIAL: 0,
    MODIFY: 1,
    MODIFIED: 2,
    UPDATE: 3,
    ERROR: 4,
    CANCELED: 5
}

export default
{
    components:
    {
        PartAdminFileLoader,
        PartContent
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
            content: null,
            content_format: [],
            contentRaw: null,
            tags: [],
            types: [],
            public: null,

            state: STATE.INITIAL,
            STATE: STATE
        } 
    },

    watch:
    {
        title(title, before)
        {
            if (before !== null)
            {
                this.state = STATE.MODIFY
                this._modified.title = title
            }
        },

        description(description, before)
        {
            if (before !== null)
            {
                this._modified.description = description
                this.state = STATE.MODIFY
            }
        },

        thumb(data, before)
        {
            if (before !== null)
            {
                this.state = STATE.MODIFY
                // this._modified.thumb = copy(data)
            }
        },

        date(date, before)
        {
            if (before !== null)
            {
                this._modified.date = date.split('T').join(' ')
                this.state = STATE.MODIFY
            }
        },

        contentRaw(text)
        {
            console.log('CONTENT', this.state)
            if (text !== null)
            {
                this.state = STATE.MODIFY

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
                this.state = STATE.MODIFY
                this._modified.public = isPublic
            }
        },

        tags(tags, before)
        {
            if (before !== null)
            {
                this.state = STATE.MODIFY
                this._modified.tags = copy(tags)
            }
        },

        types(types, before)
        {
            if (before !== null)
            {
                this.state = STATE.MODIFY
                this._modified.types = types
            }
        },

        state(state)
        {
            window.removeEventListener('keyup', this.keyUp)
            window.removeEventListener('resize', this.resizeContentRaw)

            if (state !== STATE.INITIAL) {
                window.addEventListener('keyup', this.keyUp)
                window.addEventListener('resize', this.resizeContentRaw)
                this.resizeContentRaw()
            }
        }
    },

    created()
    {
        this.init()

        if (!this.insert)
            this._modified.uid = this.post && this.post.uid
    },

    destroyed()
    {
        window.removeEventListener('resize', this.resizeContentRaw)
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

            this.state = STATE.INITIAL
            console.log('INIT', this.state)
        },

        deletePost()
        {
            this.state = STATE.MODIFY
            apiSet.deletePost(data =>
            {
                if (data.success)
                    this.$store.commit('deletePost', data.data.uid)
                this.cancel()
            }, this.post.uid)
        },

        save()
        {
            const data = this._modified

            if (this.insert)
            {
                apiSet.addPost(data =>
                {
                    if (data.success)
                        this.$store.commit('addPost', data.data)
                }, data)
                this.cancel()
            }
            else
            {
                apiSet.updatePost(data =>
                {
                    if (data.success)
                        this.$store.commit('updatePost', data.data)
                }, this.post.uid, data)
                this.cancel()
            }
        },

        close()
        {
            this.state = STATE.INITIAL
            this.$emit('close')
        },

        cancel()
        {
            this.init()
            this.state = STATE.CANCELED
            this.$nextTick(this.close)
        },

        edit()
        {
            this.state = STATE.MODIFY
        },

        getThumbSrc()
        {
            return this.post && this.thumb ? apiGet.getThumbURL(this.post.uid) : ''
        },

        getFileSrc()
        {
            return this.post
                   && this.content_format
                   && this.content_format.indexOf('file') > -1
                   && this.content_format.indexOf('image') > -1
                   && this.content
                   ? apiGet.getFileURL(this.post.uid) : ''
        },

        keyUp(keyEvent)
        {
            if (keyEvent.keyCode === 27)
                this.close()
        },

        resizeContentRaw()
        {
            const el = this.$refs.contentRaw
            this.$nextTick(() =>
            {
                el.style.cssText = 'height:auto; padding:0'
                el.style.cssText = 'height:' + el.scrollHeight + 'px'
            })
        },

        /*linkChange()
        {
            if (this.title == '')
            {
                apiGet.getDistantLink(data =>
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
                        console.log(URL)
                    }
                    else if (images.length > 0)
                    {
                        const URL = images[0].getAttribute('src')
                        console.log(URL)
                    }

                }, this.content_link)
            }
        },*/

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
