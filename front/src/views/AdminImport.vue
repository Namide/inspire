<template>
  <div>
    <h2>Home page</h2>
    <input
      type="file"
      @change="filesChange($event.target.files)"
      accept=".csv"
    />
    {{ this.ready }} / {{ this.total }} ({{ this.percent }}%)
    <pre class="console">
      <div v-for="log of lastLogs" v-html="log.text" :key="log.key"></div>
    </pre>
  </div>
</template>

<script>
import Papa from 'papaparse'
// import apiSave from '@/pure/apiSave.js'
import PostSave from '@/pure/PostSave'

export default {
  data () {
    return {
      total: 0,
      ready: 0,
      logs: []
    }
  },

  computed: {
    percent () {
      return (this.ready * 100 / this.total).toFixed(2)
    },
    lastLogs () {
      return this.logs
        .map((text, key) => ({ text, key }))
        .filter((_, i) => i > this.logs.length - 10)
    }
  },

  components: {
  },

  methods: {
    filesChange (files) {
      if (files.length) {
        console.log(files[0])
        Papa.parse(files[0], {
          header: true,
          error: (err, file, inputElem, reason) => {
            console.log(err, file, inputElem, reason)
          },
          complete: ({ data }) => {
            this.total += data.length
            this.runProcess(data)
          }
        })
        // csv()
        //   .fromFile(files[0])
        //   .then((jsonObj) => {
        //     console.log(jsonObj)
        //   })
      }
    },

    runProcess (list) {
      if (list.length > 0) {
        const postData = list.shift()

        const post = new PostSave()
        post.id = Math.round(Math.random() * 0xFFFFFFFF)
        let promise = Promise.resolve()

        if (postData.input) {
          const input = 'http://inspire.namide.com/import-files/' + postData.input
          promise = post.updateByInput(input)
        }

        promise
          .then(() => {
            if (postData.content) { post.content = postData.content }
            if (postData.date) { post.date = new Date(postData.date) }
            if (postData.status) { post.status = postData.status }
            if (postData.title) { post.title = postData.title } else { post.title = '' }
            if (postData.description) { post.description = postData.description }
            if (postData.tags) { post.tags = postData.tags.split(',') }
          })
          .then(() => {
            this.ready++
            this.logs.push('✅  ' + this.resumePost(post.getObject()))
          })
          .catch(error => {
            list.push(postData)
            this.logs.push('🔺  ' + error.message)
          })
          .finally(() => {
            if (list.length > 0) {
              requestAnimationFrame(() => this.runProcess(list))
            }
          })
      }

      // input  content  date  type  status  tags  title  description  ref

      // return apiSave.addPost(post.getPayload())
      //   .then(() => {
      //     console.log('Post success:', posts.length + '/' + count)

      //     if (posts.length > 0) {
      //       return savePost(posts, count)
      //     }
      //     return true
      //   })
      //   .catch(error => {
      //     console.log('Post failed: ' + error.message)
      //     console.log(postData)

      //     posts.push(postData)
      //     return savePost(posts, count)
      //   })
    },

    resumePost (post) {
      let str = ''
      if (post.title) { str += '  title:' + post.title + '\n' }
      if (post.types) { str += '  types:' + post.types.join(', ') + '\n' }
      if (post.tags) { str += ' tags:' + post.tags.join(', ') + '\n' }
      if (post.description) { str += '  description:' + post.description + '\n' }
      if (post.input) { str += '  input:' + post.input + '\n' }
      return str
    }
  }
}
</script>

<style lang="sass" scoped>
.console
  white-space: normal
  background: #000
  color: #DDD

</style>
