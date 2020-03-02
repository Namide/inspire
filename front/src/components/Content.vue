<template>
  <div class="content" :class="[ 'is-' + type, (invRatio !== '' ? 'has-ratio' : '') ]">

    <div v-if="invRatio" class="dummy" :style="{ paddingTop: invRatio }"></div>
    <div v-html="html" class="data">
      (Content here)
    </div>

  </div>
</template>

<script>
import marked from 'marked'
// import PostContentSave from '@/data/PostContentSave'

// https://css-tricks.com/choosing-right-markdown-parser/#article-header-id-0

export default {
  props: {
    contentObject: {
      type: Object,
      required: true
    }
  },

  computed: {
    html () {
      if (this.contentObject.type === 'embed') {
        return this.contentObject.raw
      } else if (this.contentObject.type === 'url') {
        return '<a href="' + this.contentObject.raw +
          '" target="_blank" rel="noreferrer noopener">' +
          this.contentObject.raw.replace(/http:\/\/|https:\/\//, '') +
          '</a>'
      } else if (this.contentObject.type === 'text') {
        return marked(this.contentObject.raw)
      }

      return 'type not know'
    },

    type () {
      return this.contentObject.type || 'text'
    },

    invRatio () {
      if (this.contentObject.type === 'embed') {
        if (this.contentObject.width && this.contentObject.height) {
          return (100 * this.contentObject.height / this.contentObject.width) + '%'
        }
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
