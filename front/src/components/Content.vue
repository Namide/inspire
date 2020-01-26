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
import PostContent from '@/data/PostContent'

// https://css-tricks.com/choosing-right-markdown-parser/#article-header-id-0

console.log(marked)

export default {
  props: {
    json: { type: Object }
  },

  computed: {
    html () {
      const postContent = new PostContent(this.json)

      if (postContent.isURL()) {
        return '<a href="' + postContent.getRaw() +
          '" target="_blank" rel="noreferrer noopener">' +
          postContent.getRaw().replace(/http:\/\/|https:\/\//, '') +
          '</a>'
      } else if (postContent.isEmbed()) {
        return postContent.getRaw()
      } else if (postContent.isText()) {
        return marked(postContent.getRaw())
      }

      return postContent.isText() + ' not know'
    },

    type () {
      const postContent = new PostContent(this.json)
      return postContent.getType()
    },

    ratio () {
      const postContent = new PostContent(this.json)

      if (postContent.isEmbed()) {
        if (postContent.json.height && postContent.json.width) {
          return (100 * postContent.json.height / postContent.json.width).toFixed(3) + '%'
        } else {
          return '56.25%'
        }
      }

      return ''
    }
  }

  // watch: {
  //   data: 'setContent'
  // },
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

    &>*
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      border: 0

.dummy
  width: 100%
</style>
