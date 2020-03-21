<template>
  <div>
    <h2>Home page</h2>
    <input
      type="file"
      @change="filesChange($event.target.files)"
      accept=".csv"
    />
    <br>
    <template v-if="ended">
      succes: <span class="green">{{ ready }}</span> / <strong>{{ total }}</strong><br>
      errors: <span class="red">{{ errors.length }}</span><br>
      time: {{ endTime }}

    </template>
    <template v-else>
      <template v-if="this.total">
        succes: <span class="green">{{ ready }}</span> / <strong>{{ total }}</strong><br>
        errors: <span class="red">{{ errors.length }}</span><br>
        percent: {{ this.percent }}%<br>
        time: {{ endTime }}<br>
      </template>
      <template v-if="restTime">
        rest:{{ restTime }}
      </template>
    </template>
    <pre class="console">
      <div v-for="log of lastLogs" v-html="log.text" :key="log.key"></div>
    </pre>
  </div>
</template>

<script>
import Papa from 'papaparse'
// import apiSave from '@/pure/apiSave.js'
import PostSave from '@/pure/PostSave'
import apiSave from '@/pure/apiSave'

export default {
  data () {
    return {
      startedTime: 0,
      restTime: '',
      endTime: null,
      ended: false,
      errors: [],
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
        // .filter((_, i) => i > this.logs.length - 10)
    }
  },

  components: {
  },

  methods: {
    filesChange (files) {
      const parallels = 5
      if (files.length) {
        Papa.parse(files[0], {
          header: true,
          error: (err, file, inputElem, reason) => {
            console.log(err, file, inputElem, reason)
          },
          complete: ({ data }) => {
            this.startedTime = Date.now()
            this.total += data.length
            const list = data.map((postData, i) => Object.assign({ id: i }, postData))

            for (let i = 0; i < parallels; i++) {
              this.runProcess(list)
            }
          }
        })
      }
    },

    msToTime (distance) {
      const hours = Math.floor(distance / 3600000)
      distance -= hours * 3600000
      const minutes = Math.floor(distance / 60000)
      distance -= minutes * 60000
      const seconds = Math.floor(distance / 1000)
      return `${hours}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`
    },

    updateEndTime () {
      this.endTime = this.msToTime(Date.now() - this.startedTime)
    },

    updateRestTime () {
      const passed = Date.now() - this.startedTime
      const distance = this.total * passed / this.ready - passed

      this.restTime = this.msToTime(distance)
    },

    runProcess (list) {
      this.updateRestTime()
      this.updateEndTime()
      if (list.length > 0) {
        const postData = list.shift()
        const isLast = list.length < 1

        // 13:12 -> 15:57

        const post = new PostSave()
        post.id = Math.round(Math.random() * 0xFFFFFFFF)
        let promise = Promise.resolve()

        if (postData.input) {
          if (postData.input.indexOf('img/') === 0) {
            const input = 'http://inspire.namide.com/import-files/' + postData.input
            promise = post.updateByInput(input)
          } else {
            const input = postData.input
            promise = post.updateByInput(input)
          }
        }

        promise
          .then(() => {
            if (postData.id) { post.id = postData.id }
            if (postData.content) { post.content = postData.content }
            if (postData.date) { post.date = new Date(postData.date) }
            if (postData.status) { post.status = postData.status }
            if (postData.title) { post.title = postData.title } else { post.title = '' }
            if (postData.description) { post.description = postData.description }
            if (postData.tags) { post.tags = postData.tags.split(',') }
          })
          .then(() => {
            // this.logs.push('✅  id:' + postData.id)
            // this.logs.push(this.resumePost(post.getObject()))

            const payload = post.getPayload()
            console.log('payload:', payload)
            return apiSave.addPost(payload)
          })
          .then(data => {
            console.log('data:', data)
            this.ready++
          })
          .catch(error => {
            this.errors.push(postData)
            this.logs.push('🔺  id:' + postData.id + ' ' + error.message)
            this.logs.push(this.resumePost(post.getObject()))
          })
          .finally(() => {
            if (list.length > 0) {
              requestAnimationFrame(() => this.runProcess(list))
            } else {
              this.updateEndTime()
              if (isLast) {
                this.ended = true
              }
            }
            /* else if (this.errors.length > 0) {
              const newList = this.errors
              this.errors = []
              requestAnimationFrame(() => this.runProcess(newList))
            } */
          })
      }
    },

    resumePost (post) {
      let str = ''
      const tab = '&nbsp;&nbsp;&nbsp;'
      if (post.title) { str += tab + 'title:' + post.title + '<br>' }
      if (post.types) { str += tab + 'types:' + post.types.join(', ') + '<br>' }
      if (post.tags) { str += tab + 'tags:' + post.tags.join(', ') + '<br>' }
      if (post.description) { str += tab + 'description:' + post.description + '<br>' }
      if (post.input) { str += tab + 'input:' + post.input + '<br>' }
      str += '---------------------'
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

.green
  color: green

.red
  color: red
</style>
