import { h, app } from 'hyperapp'
import PartAdminFileLoader from '../part-admin-file-loader'
import './style.sass'
import Post from '../../../model/Post'
import PartInputTexarea from '../part-input-textarea'
import PartContent from '../part-content'
import SetPostContent from '../../../utils/SetPostContent';

const copy = obj => JSON.parse(JSON.stringify(obj))
const getToday = () => new Date(Date.now()).toJSON().split('.')[0]

export default ({ onClose }) => (state, actions) =>
{
    const post = new Post(state.edit.post)
    let modifiedData = {  }

    const nextState = (state, actions, modifiedData) =>
    {
        const num = state.edit.modal.state + 1
        actions.custom({ edit: { modify: modifiedData, modal: { state: num } } })
        modifiedData = { }
    }

    const thumbChange = (file, modifiedData) =>
    {
        if (!file)
        {
            modifiedData.thumb = null
        }
        else
        {
            modifiedData.thumb = file
        }
    }

    const fileChange = (file, modifiedData) =>
    {
        if (!file)
        {
            modifiedData.content = null
            modifiedData.content_format = []
            return
        }

        const content_format = ['file', ...file.type.split('/').map(type => type.toLowerCase())]
        const content = {
            name: file.name,
            size: file.size,
            type: file.type
        }

        modifiedData.content_format = content_format
        modifiedData.content = content
        modifiedData.file = file

        
        // this.file = file
        // this._modified.content_file = file

        const types = file.type ? file.type.split('/') : []
        if (types.length > 0 && this.types.indexOf(types[0]) < 0)
            modifiedData.types = [ ...( post.data.type || [] ), types[0] ]

        if (file.name && file.name !== ''
            && (modifiedData.title == '' || modifiedData.title == undefined)
            && (post.data.title == '' || post.data.title == undefined))
        {
            const arr = file.name.trim().split('.')
            arr.pop()

            const title = arr.join(' ')
                .split('_').join(' ')
                .split('-').join(' ')
            
            if (title.length > 0)
                modifiedData.title = title.charAt(0).toUpperCase() + title.slice(1)
        }
    }

    const setContent = (text, modifiedData) =>
    {
        if (text !== null)
        {
            const content = SetPostContent.extractContent(text)
            const format = SetPostContent.extractFormat(content)
            modifiedData.content = content
            modifiedData.content_format = format
        }
    }

    return (
        <div class="admin-post-edit">

            {
                (state.edit.modal.state === 0) ? (
                    
                    <div>
                        <label>
                            <input type="checkbox" checked={ state.edit.modal.isFile } onchange={ event => actions.custom({edit: { modal: {isFile: event.target.checked }}}) } /> File
                        </label>

                        { state.edit.modal.isFile ? (
                            <div>
                                <PartAdminFileLoader onchange={ file => thumbChange(file, modifiedData) } src={ post.getFileSrc() || ''}/>
                            </div>
                        ) : (
                            <div>
                                <PartInputTexarea value={ post.getContentRaw() } onchange={ val => setContent(val, modifiedData) } placeholder="Content (URL, markdown, HTML, embed...)"></PartInputTexarea>
                                <PartContent post={ post }></PartContent>
                            </div>
                        ) }
                        
                        <button onclick={ () => nextState(state, actions, modifiedData) }>Ok</button>
                    </div>

                ) : (state.edit.modal.state === 1) ? (

                    <span>{ JSON.stringify(state.edit.modify) }</span>

                ) : (

                    <span>State 2</span>

                )
            }
            
        </div>
    )
}

/*<div v-if="state === 0">
    <part-admin-file-loader v-if="isFile" @file="data => {fileChange(data); validContent()}" :src="getFileSrc() || ''" :only-img="false"></part-admin-file-loader>
    <template v-else>
        <part-input-textarea @submit="validContent" :value="contentRaw" @change="argValue => contentRaw = argValue" placeholder="Content (URL, markdown, HTML, embed...)"></part-input-textarea>
        <part-content :data="content"></part-content>
    </template>

    <button @click="validContent">Ok</button>
</div>

<div v-else="state === 1">


    <input type="datetime-local" v-model="date" class="date">

    <input type="text" v-model="title" placeholder="title" class="title">

    <part-admin-file-loader @file="thumbChange" :src="getThumbSrc() || ''" :info="thumb" :only-img="true"></part-admin-file-loader>


    <input type="text" v-model="types" placeholder="types">

    <part-input-textarea :value="description" @change="argValue => description = argValue" placeholder="Description"></part-input-textarea>
    


    <part-admin-file-loader v-if="isFile" @file="fileChange" :src="getFileSrc() || ''" :only-img="false"></part-admin-file-loader>
    <template v-else>
        <part-input-textarea @submit="validContent" :value="contentRaw" @change="argValue => contentRaw = argValue" placeholder="Content (URL, markdown, HTML, embed...)"></part-input-textarea>
        <part-content :data="content"></part-content>
    </template>



    <!-- :info="content"  -->
    <!-- <part-admin-file-loader @file="fileChange" :src="getFileSrc() || ''" :only-img="false"></part-admin-file-loader> -->

    <input type="text" v-model="tags" placeholder="tags">

    <!-- <part-input-textarea :value="contentRaw" @change="argValue => contentRaw = argValue" placeholder="Content (URL, markdown, HTML, embed...)"></part-input-textarea>
    <part-content :data="content"></part-content> -->

    <input type="checkbox" v-model="public"> Public
    <button @click="save" v-html="insert ? 'Create' : 'Update'"></button>
    <button v-if="!insert" @click="deletePost">Delete</button>
    <button @click="cancel">Cancel changes</button>
</div>*/


/*
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
        },

        save()
        {
            const data = this._modified
            console.log(data, this.insert)

            if (this.insert)
            {
                this.$store.dispatch('addPost', {post: data})
                this.cancel()
            }
            else
            {
                this.$store.dispatch('updatePost', {uid: this.post.uid, data: data})
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
*/