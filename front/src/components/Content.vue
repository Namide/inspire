<template>
  <div class="content" :class="[ 'is-' + type, (invRatio !== '' ? 'has-ratio' : '') ]">

    <div v-if="invRatio" class="dummy" :style="{ paddingTop: invRatio }"></div>
    <div v-html="html" class="data">
      (Content here)
    </div>

  </div>
</template>

<script>

export default {
  props: {
    type: {
      type: String,
      default: 'text'
    },
    content: {
      type: String,
      required: true
    }
  },

  computed: {
    html () {
      if (this.type === 'embed') {
        return this.content
      } else if (this.type === 'url') {
        return '<a href="' + this.content +
          '" target="_blank" rel="noreferrer noopener">' +
          this.content.replace(/http:\/\/|https:\/\//, '') +
          '</a>'
      } else if (this.type === 'text') {
        return this.content
      }

      return 'type not know'
    },

    invRatio () {
      if (this.type === 'embed') {
        if (this.content.trim().match(/<iframe(.+)<\/iframe>/g) !== null) {
          // const regExS = /<iframe[^>]+src=["']?(.+?)["'\s>]/gi
          const regExW = /<iframe[^>]+width=["']?(\d+%?)/gi
          const regExH = /<iframe[^>]+height=["']?(\d+%?)/gi

          // const exS = regExS.exec(raw)
          const exW = regExW.exec(this.content)
          const exH = regExH.exec(this.content)

          // const src = exS && exS.length > 1 ? exS[1] : null
          const width = exW && exW.length > 1 ? exW[1] || 640 : 640
          const height = exH && exH.length > 1 ? exH[1] || 360 : 360

          if (width && height) {
            return (100 * height / width) + '%'
          }
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
