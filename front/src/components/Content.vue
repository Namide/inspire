<template>
  <div class="content" :class="[ 'is-' + type, (ratio !== '' ? 'has-ratio' : '') ]">

    <div v-if="ratio" class="dummy" :style="{ paddingTop: ratio }"></div>
    <div v-html="html" class="data">
      (Content here)
    </div>

  </div>
</template>

<script>
import marked from 'marked'
// import PostContentSave from '@/data/PostContentSave'

// https://css-tricks.com/choosing-right-markdown-parser/#article-header-id-0

// console.log(marked)

export default {
  props: {
    contentObject: {
      type: Object,
      required: true
    }
  },

  computed: {
    html () {
      if (this.contentObject.embed) {
        return this.contentObject.embed
      } else if (this.contentObject.url) {
        return '<a href="' + this.contentObject.url +
          '" target="_blank" rel="noreferrer noopener">' +
          this.contentObject.url.replace(/http:\/\/|https:\/\//, '') +
          '</a>'
      } else if (this.contentObject.raw) {
        return marked(this.contentObject.raw)
      }

      return 'type not know'
    },

    type () {
      if (this.contentObject.embed) {
        return 'embed'
      } else if (this.contentObject.url) {
        return 'url'
      }

      return 'text'
    },

    ratio () {
      if (this.contentObject.embed) {
        return '56.25%'
      }

      return ''
    }
  }
}
</script>

<style lang="sass" scoped>
.content
  position: relative

.has-ratio
  .data
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%

    &>::v-deep *
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      border: 0

.dummy
  width: 100%
</style>
