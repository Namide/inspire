<template>
  <div class="modal">

    <div class="bg" @click="close"></div>

    <div class="box">

      <label><input type="checkbox" v-model="isFile">File</label>

      <div v-if="state === 0">

        <AdminFileLoader v-if="isFile" @file="data => { fileChange(data); validContent() }" :src="getFileSrc() || ''" :only-img="false"></AdminFileLoader>
        <template v-else>
          <InputTextarea @submit="validContent" :value="input.contentRaw" @change="val => $set(input, 'contentRaw', val)" placeholder="Content (URL, markdown, HTML, embed...)"></InputTextarea>
          <Content :json="contentJson"></Content>
        </template>
        <button @click="validContent">Ok</button>

      </div>
      <div v-else-if="state === 1">

        <input type="datetime-local" v-model="date" class="date">
        <input type="text" v-model="title" placeholder="title" class="title">
        <AdminFileLoader @file="thumbChange" :src="getThumbSrc() || ''" :info="thumb" :only-img="true"></AdminFileLoader>
        <input type="text" v-model="types" placeholder="types">
        <InputTextarea :value="description" @change="argValue => description = argValue" placeholder="Description"></InputTextarea>

        <AdminFileLoader v-if="isFile" @file="fileChange" :src="getFileSrc() || ''" :only-img="false"></AdminFileLoader>
        <template v-else>
          <InputTextarea @submit="validContent" :value="inputContentRaw" @change="argValue => inputContentRaw = argValue" placeholder="Content (URL, markdown, HTML, embed...)"></InputTextarea>
          <Content :data="content"></Content>
        </template>

        <!-- :info="content"  -->
        <!-- <AdminFileLoader @file="fileChange" :src="getFileSrc() || ''" :only-img="false"></AdminFileLoader> -->

        <input type="text" v-model="tags" placeholder="tags">

        <!-- <InputTextarea :value="inputContentRaw" @change="argValue => inputContentRaw = argValue" placeholder="Content (URL, markdown, HTML, embed...)"></InputTextarea>
        <Content :data="content"></Content> -->

        <input type="checkbox" v-model="isPublic"> Public
        <button @click="save" v-html="insert ? 'Create' : 'Update'"></button>
        <button v-if="!insert" @click="deletePost">Delete</button>
        <button @click="cancel">Cancel changes</button>
      </div>

    </div>
  </div>
</template>

<script>
import api from '../pure/api'
// import api from '../pure/api'
import AdminFileLoader from '@/components/AdminFileLoader.vue'
import PostContent from '@/data/PostContent'
import Content from '@/components/Content.vue'
import InputTextarea from '@/components/InputTextarea.vue'

export default
{
  components: {
    AdminFileLoader,
    Content,
    InputTextarea
  },

  props: {
    post: { type: Object, default: null },
    insert: { type: Boolean, default: false }
  },

  data () {
    return {
      isFile: false,

      input: {
        contentRaw: ''
      },

      // inputContentRaw: '',

      // title: null,
      // description: null,
      // thumb: null,
      // date: null,
      // content: null,
      // contentFormat: [],
      // tags: [],
      // types: [],
      // isPublic: false,

      state: 0
    }
  },

  computed: {
    content () {
      const post = new PostContent()
      post.fromRaw(this.input.contentRaw)
      return post.getJson()
    },

    contentJson () {
      const post = new PostContent()
      post.fromRaw(this.input.contentRaw)
      return post.getJson()
    }
  },

  watch: {
    // title (title, before) {
    //   if (before !== null) {
    //     this._modified.title = title
    //   }
    // },

    // description (description, before) {
    //   if (before !== null) {
    //     this._modified.description = description
    //   }
    // },

    // thumb (data, before) {
    //   if (before !== null) {
    //     // this._modified.thumb = copy(data)
    //   }
    // },

    // date (date, before) {
    //   if (before !== null) {
    //     this._modified.date = date.split('T').join(' ')
    //   }
    // },

    // inputContentRaw (text) {
    //   if (text !== null) {
    //     this.postContent.fromRaw(text)

    //     const content = this.postContent.getJson()
    //     const format = this.postContent.getType()

    //     this._modified.content = content
    //     this._modified.contentFormat = format
    //     this.content = content
    //     this.contentFormat = format

    //     // console.log('content formated:', content)
    //   }
    // },

    // /* content_file(data, before)
    //     {
    //         if (before !== null)
    //         {
    //             this.state = STATE.MODIFY
    //             // this._modified.content_file = copy(data)
    //         }
    //     }, */

    // public (isPublic, before) {
    //   if (before !== null) {
    //     this._modified.public = isPublic
    //   }
    // },

    // tags (tags, before) {
    //   if (before !== null) {
    //     this._modified.tags = copy(tags)
    //   }
    // },

    // types (types, before) {
    //   if (before !== null) {
    //     this._modified.types = types
    //   }
    // }

    // state(state)
    // {

    //     if (state !== STATE.INITIAL) {
    //         window.addEventListener('keyup', this.keyUp)
    //         window.addEventListener('resize', this.resizeinputContentRaw)
    //         this.resizeinputContentRaw()
    //     }
    // }
  },

  created () {
    // this.postContent = new PostContent()

    window.removeEventListener('keyup', this.keyUp)

    this.init()

    if (!this.insert) {
      this._modified.uid = this.post && this.post.uid
      this.state = 1
    }
  },

  destroyed () {
    window.removeEventListener('keyup', this.keyUp)
  },

  methods: {
    init () {
      // this._modified = { }

      // this.title = copy((this.post && this.post.title) || '')
      // this.description = copy((this.post && this.post.description) || '')
      // this.thumb = copy((this.post && this.post.thumb) || null)
      // this.date = copy((this.post && this.post.date) || getToday()).split(' ').join('T')
      // this.contentFormat = copy((this.post && this.post.contentFormat) || [])
      // this.content = copy((this.post && this.post.content) || null)

      this.$set(this.input, 'contentRaw', copy((this.post && this.post.content && this.post.content.raw) || ''))

      // this.inputContentRaw = this.post && this.post.content && this.post.content.raw ? copy(this.post.content.raw) : null
      // this.isPublic = this.post ? !!this.post.public : true

      // this.tags = copy((this.post && this.post.tags) || [])
      // this.types = copy((this.post && this.post.types) || [])
    },

    validContent () {
      if (this.content && this.content.url) {
        this.updateByLink(this.content.url)
          .then(() => this.state++)
      } else {
        this.state++
      }
    },

    deletePost () {
      this.$store.dispatch('deletePost', { uid: this.post.uid })
      /* api.deletePost(data =>
      {
          if (data.success)
              this.$store.commit('deletePost', data.data.uid)

          this.cancel()
      }, this.post.uid) */
    },

    save () {
      const data = this._modified
      console.log(data, this.insert)

      if (this.insert) {
        this.$store.dispatch('addPost', { post: data })
        /* api.addPost(data =>
                {
                    if (data.success)
                        this.$store.commit('addPost', data.data)

                }, data) */
        this.cancel()
      } else {
        this.$store.dispatch('updatePost', { uid: this.post.uid, data: data })
        /* api.updatePost(data =>
                {
                    if (data.success)
                        this.$store.commit('updatePost', data.data)

                }, this.post.uid, data) */
        this.cancel()
      }
    },

    close () {
      this.$emit('close')
    },

    cancel () {
      // this.init()
      // this.$nextTick(this.close)
      this.close()
    },

    // edit()
    // {
    //     this.state = STATE.MODIFY
    // },

    getThumbSrc () {
      return this.post && this.thumb ? api.getThumbURL(this.post.uid) : ''
    },

    getFileSrc () {
      return this.post &&
        this.contentFormat &&
        this.contentFormat.indexOf('file') > -1 &&
        this.contentFormat.indexOf('image') > -1 &&
        this.content ? api.getFileURL(this.post.uid) : ''
    },

    keyUp (keyEvent) {
      if (keyEvent.keyCode === 27) { this.close() }
    },

    updateByLink (URL) {
      return api.distantObject(URL)
        .then(data => {
          console.log('-->')
          console.log(data)
        })
        /* .then(data => {
          console.log(data)
          return data
          // const distantPage = document.implementation.createHTMLDocument('')
          // distantPage.open()
          // distantPage.write(data.data)
          // distantPage.close()

          // if (distantPage.title !== '' && this.title === '') { this.title = distantPage.title }

          // const description = distantPage.querySelector('meta[name="description"]')
          // if (description && description.content !== '') {
          //   this.description = description.content
          // }

          // const image = distantPage.querySelector('meta[property="og:image"]')
          // const images = distantPage.querySelectorAll('a[href]')
          // if (image) {
          //   const URL = image.getAttribute('content')
          //   console.log(URL)
          // } else if (images.length > 0) {
          //   const URL = images[0].getAttribute('src')
          //   console.log(URL)
          // }
        })
        .then(response => {
          try {
            const blob = response.blob()
            const objectURL = URL.createObjectURL(blob)
            return {
              type: 'img',
              base64: objectURL
            }
          } catch (error) {
            return response
          }
        }) */
    },

    thumbChange (file) {
      if (!file) {
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

    fileChange (file) {
      if (!file) {
        this.content = null
        this.contentFormat = []
        this._modified.file = null
        this._modified.content = null
        this._modified.contentFormat = []
        return
      }

      const contentFormat = ['file', ...file.type.split('/').map(type => type.toLowerCase())]
      const content = {
        name: file.name,
        size: file.size,
        type: file.type
      }

      this.contentFormat = copy(contentFormat)
      this.content = copy(content)
      this._modified.contentFormat = contentFormat
      this._modified.content = content
      this._modified.file = file

      // this.file = file
      // this._modified.content_file = file

      const types = file.type ? file.type.split('/') : []
      if (types.length > 0 && this.types.indexOf(types[0]) < 0) { this.types.push(types[0]) }

      if (file.name && file.name !== '' && this.title === '') {
        const arr = file.name.trim().split('.')
        arr.pop()

        const title = arr.join(' ')
          .split('_').join(' ')
          .split('-').join(' ')

        if (title.length > 0) { this.title = title.charAt(0).toUpperCase() + title.slice(1) }
      }
    }
  }
}

const copy = obj => JSON.parse(JSON.stringify(obj))
// const getToday = () => new Date(Date.now()).toJSON().split('.')[0]
</script>

<style lang="sass" scoped>
input
  // border: none

.modal
  position: absolute
  left: 0
  top: 0
  width: 100%
  height: 100%
  z-index: 2

.bg
  position: absolute
  left: 0
  top: 0
  width: 100%
  height: 100%
  background: rgba(0, 0, 0, 0.5)

.box
  position: relative
  background: #FFF
  margin: 10%

.date
  margin-left: auto
  display: block

.title
  font-size: 1.25em
  padding: 0.5em
  display: block
  width: 100%
</style>
