<template>
  <div>
    <h2>Home page</h2>
    <input
      type="file"
      @change="filesChange($event.target.files)"
      accept=".csv"
    />
    {{ this.ready }} / {{ this.total }} ({{ this.percent }}%)
    <pre>
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
        const postDataSave = JSON.parse(JSON.stringify(postData))

        const post = new PostSave()
        // console.log(postData)
        if (postData.input) {
          const input = 'http://inspire.namide.com/import-files/' + postData.input
          delete postData.input
          console.log(input)
          post.updateByInput(input)
            .then(data => {
              this.ready++
              this.logs.push('✅ ' + JSON.stringify(post.getObject()))
            })
            .catch(error => {
              list.push(postDataSave)
              this.logs.push('🔺 ' + error.message)
            })
            .finally(() => {
              if (list.length > 0) {
                requestAnimationFrame(() => this.runProcess(list))
              }
            })
        } else {
          this.ready++
          this.logs.push('✅ ' + 'simple')
          requestAnimationFrame(() => this.runProcess(list))
        }
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
      //     console.log(postDataSave)

      //     posts.push(postDataSave)
      //     return savePost(posts, count)
      //   })
    }
  }
}
</script>
