<template>
  <div class="modal">

    <div class="bg" @click="close"></div>

    <div class="box">

      <label><input type="checkbox" v-model="isFile">File</label>

      <div v-if="state === 0">

        <AdminFileLoader v-if="isFile" @change="fileChange" :src="input.image ? input.image.src : ''" :colors="input.colors" :only-img="false"></AdminFileLoader>
        <template v-else>
          <InputTextarea @submit="validContent" :value="input.contentRaw" @change="val => $set(input, 'contentRaw', val)" placeholder="Content (URL, markdown, HTML, embed...)"></InputTextarea>
          <!-- <Content :json="contentJson"></Content> -->
        </template>
        <button @click="validContent">Ok</button>

      </div>
      <div v-else-if="state === 1">

        <input type="datetime-local" v-model="input.date" class="date">
        <input type="text" v-model="input.title" placeholder="title" class="title">
        <InputTextarea :value="input.description" @change="argValue => input.description = argValue" placeholder="Description"></InputTextarea>
        <ul>
          <li type="text" v-for="type of input.types" v-html="type" :key="type"></li>
        </ul>
        <AdminFileLoader v-if="isFile" @change="fileChange" :src="input.image ? input.image.src : ''" :colors="input.colors" :only-img="false"></AdminFileLoader>
        <template v-else>
          <InputTextarea @submit="validContent" :value="input.contentObject.raw" @change="argValue => input.contentObject.raw = argValue" placeholder="Content (URL, markdown, HTML, embed...)"></InputTextarea>
          <Content :data="input.contentObject"></Content>
        </template>

        <!-- :info="content"  -->
        <!-- <AdminFileLoader @file="fileChange" :src="getFileSrc() || ''" :only-img="false"></AdminFileLoader> -->

        <Tags :tags="input.tags ? input.tags : []" @update:tags="val => input.tags = val" placeholder="Tags (separated by comas)"/>

        <!-- <InputTextarea :value="inputContentRaw" @change="argValue => inputContentRaw = argValue" placeholder="Content (URL, markdown, HTML, embed...)"></InputTextarea>
        <Content :data="content"></Content> -->

        <select v-model="input.status">
          <option value="public">Public</option>
          <option value="protected">Protected</option>
          <option value="private">Private</option>
          <option value="draft">Draft</option>
          <option value="deleted">Deleted</option>
        </select>

        <button @click="save" v-html="create ? 'Create' : 'Update'"></button>
        <button v-if="!create" @click="deletePost">Delete</button>
        <button @click="cancel">Cancel changes</button>
      </div>

    </div>
  </div>
</template>

<script>
// import api from '../pure/apiSave'
// import api from '../pure/api'
import AdminFileLoader from '@/components/AdminFileLoader.vue'
import Tags from '@/components/Tags'
// import Content from '@/components/Content.vue'
import InputTextarea from '@/components/InputTextarea.vue'
import PostSave from '@/data/PostSave'

// const copy = obj => JSON.parse(JSON.stringify(obj))

export default
{
  components: {
    AdminFileLoader,
    // Content,
    InputTextarea,
    Tags
  },

  props: {
    post: {
      type: Object,
      default () {
        return {}
      }
    },
    create: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      isFile: false,
      input: null,
      state: 0
    }
  },

  created () {
    // this.postContent = new PostContent()

    this.postSave = new PostSave()
    this.input = new PostSave().getObject()
    this.inputFile = null

    window.addEventListener('keyup', this.keyUp)

    if (!this.create) {
      this._modified.uid = this.post && this.post.uid
      this.state = 1
    }
  },

  destroyed () {
    window.removeEventListener('keyup', this.keyUp)
    this.postSave.dispose()
  },

  methods: {
    validContent () {
      this.postSave.setContentRaw(this.input.contentRaw)
        .then(postSave => {
          this.input = JSON.parse(JSON.stringify(postSave.getObject()))
          this.state++
        })
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
      console.log(data, this.create)

      if (this.create) {
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

    keyUp (keyEvent) {
      if (keyEvent.keyCode === 27) { this.close() }
    },

    fileChange (file) {
      if (file) {
        this.postSave.updateByFile(file)
          .then(postSave => {
            this.input = JSON.parse(JSON.stringify(postSave.getObject()))
            console.log(postSave)
          })
      } else {
        this.postSave.removeFile()
          .then(postSave => {
            this.input = JSON.parse(JSON.stringify(postSave.getObject()))
            console.log(postSave)
          })
      }

      /* if (!file) {
        this.content = null
        this.contentFormat = []
        this._modified.file = null
        this._modified.content = null
        this._modified.contentFormat = []
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
      } */
    }
  }
}
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
