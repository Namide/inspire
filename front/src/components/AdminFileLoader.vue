<template>
  <div>
    <input v-if="!finalSrc" type="file" :disabled="false" @change="filesChange($event.target.files)" :accept="onlyImg ? 'image/*' : '*'">
    <button v-else @click="deleteFile">Delete image</button>

    <div v-if="isImg && finalSrc !== ''" class="file-img" :style="{ backgroundImage: 'url(' + finalSrc + ')' }">

      <template v-if="info">
        <div v-for="(data, key) of info" :key="key + data">
          <small v-if="key === 'colors'">
            <strong>{{ key }}</strong>:
            <span v-for="color of data" class="color" :style="{ background: color }" :key="color"></span>
          </small>
          <small v-else>
            <strong>{{ key }}</strong>: {{ data }}
          </small>
        </div>
      </template>

    </div>
    <template v-else-if="info">
      <div v-for="(data, key) of info" :key="key + data">
        <small v-if="key === 'colors'">
          <strong>{{ key }}</strong>:
          <span v-for="color of data" class="color" :style="{ background: color }" :key="color"></span>
        </small>
        <small v-else>
          <strong>{{ key }}</strong>: {{ data }}
        </small>
      </div>
    </template>
  </div>
</template>

<script>
const STATE = {
  INITIAL: 0,
  MODIFY: 1,
  MODIFIED: 2,
  UPDATE: 3,
  ERROR: 4
}

export default
{
  props: {
    src: { type: String, default: '' },
    info: { type: Object, default: null },
    onlyImg: { type: Boolean, default: false }
  },

  watch: {
    src (src) {
      this.finalSrc = src
    }
  },

  data () {
    return {
      finalSrc: '',
      isImg: true,
      state: STATE.INITIAL
    }
  },

  created () {
    this.finalSrc = this.src || ''
  },

  methods: {
    filesChange ([file]) {
      const isImage = file.type.split('/').shift().toLowerCase() === 'image'
      if (isImage) {
        this.imgViewer(file)
      }

      this.$emit('file', file)

      this.state = STATE.MODIFY
    },

    deleteFile () {
      this.$emit('file', null)
    },

    imgViewer (file) {
      if (file.size > 1e9) {
        this.finalSrc = ''
        return console.warn('image too big!')
      }

      const reader = new FileReader()
      reader.addEventListener('load', event => {
        this.finalSrc = event.target.result
      })
      reader.readAsDataURL(file)
    }
  }
}
</script>

<style lang="sass" scoped>
.color
  width: 16px
  height: 16px
  display: inline-block

.file-img
  width: 256px
  height: 256px
  background-repeat: no-repeat
  background-position: center
  background-size: cover

  &:hover
    background-size: contain
</style>
