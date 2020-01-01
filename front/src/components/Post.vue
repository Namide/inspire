<template>
  <a :href="href" target="blank" class="post" :class="classData" :style="postStyle">

    <h1 class="title">
      {{ data.title }}
    </h1>

    <time class="date">
      {{ data.date }}
    </time>

    <p class="description">
      {{ data.description }}
    </p>

    <ul class="tags">
      <li v-for="tag of data.tags" class="tag" :key="tag">
        {{ tag }}
      </li>
    </ul>

    <span class="score">
      {{ data.score }}/5
    </span>

    <transition name="thumbfade">
      <div v-if="isThumbLoaded && thumbStyle" :style="thumbStyle" class="thumb"></div>
    </transition>

  </a>
</template>

<script>
import api from '@/pure/api'

const getPgcd = (a, b) => {
  while (b > 0) {
    var r = a % b
    a = b
    b = r
  }

  return a
}

export default
{
  components: {
  },

  props: {
    data: { type: Object },
    displayMode: { type: String, default: 'text' }
  },

  data () {
    return {
      displayImage: false,
      classData: [],
      // isHidden: true,
      postStyle: { },
      thumbStyle: false,
      isThumbLoaded: false,
      href: false,
      w: 1,
      h: 1
    }
  },

  created () {
    const size = this.getSize()

    const max = 6
    let w = 1
    let h = 1
    if (size[0] > size[1]) {
      w = max
      h = Math.round(w * size[1] / size[0]) || 1
    } else {
      h = max
      w = Math.round(h * size[0] / size[1]) || 1
    }

    const p = getPgcd(w, h)
    w /= p
    h /= p

    this.setSize(w, h)

    if (this.getImg() && this.displayMode === 'thumb') {
      this.$set(this.postStyle, 'background-color', this.getColor())
    }

    if (this.displayMode === 'text' &&
            this.data.content_format.indexOf('URL') > -1) { this.href = this.data.content.URL }
  },

  mounted () {
    if (this.getImg()) { this.optimizeLoad() }
  },

  methods: {
    optimizeLoad () {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: [0, 1]
      }

      this._observer = new IntersectionObserver(this.onInOut, options)
      this._observer.observe(this.$el)
    },

    onInOut (data) {
      if (data[0].intersectionRatio > 0) {
        if (!this.isThumbLoaded) {
          this._thumb = new Image()
          this._thumb.onload = () => {
            this.isThumbLoaded = true
          }
          this._thumb.src = this.getSrc()
          if (this._thumb.complete) {
            this.isThumbLoaded = true
          }
        }

        this.thumbStyle = {
          'background-image': 'url(' + this.getSrc() + ')'
        }
      } else {
        if (this._thumb && !this.isThumbLoaded) {
          this._thumb.src = null
          this._thumb = null
        }
        this.thumbStyle = false
      }
    },

    setSize (w = 1, h = 1) {
      const areaMax = 12
      const areaMin = 4
      // const area = w * h
      const areaDo = this.data.score * (areaMax - areaMin) + areaMin

      const sideMax = 6
      // const sideMin = 1

      let mult = 5
      while (w * (mult + 1) * h * (mult + 1) <= areaDo && Math.max(w * mult + 1, h * mult + 1) < sideMax) { mult++ }
      while (Math.max(w * mult, h * mult) > sideMax) { mult-- }

      w *= mult
      h *= mult

      this.classData.push('w' + w, 'h' + h)
      // this.$set(this.postStyle, 'grid-column-end', 'span ' + w * mult)
      // this.$set(this.postStyle, 'grid-row-end', 'span ' + h * mult)
    },

    getSize () {
      const thumb = this.getImg()
      if (thumb) { return [thumb.width, thumb.height] }

      return [3, 1]
    },

    getColor () {
      return this.data.thumb && this.data.thumb.colors && this.data.thumb.colors.length > 0 ? this.data.thumb.colors[0] : 'rgba(0,0,0,0)'
    },

    getImg () {
      return this.data.thumb ? this.data.thumb
        : this.data.content_format &&
                   this.data.content_format.indexOf('file') > -1 &&
                   this.data.content_format.indexOf('image') &&
                   this.content ? this.data.content : null
    },

    getSrc () {
      if (this.data.thumb) { return api.getThumbURL(this.data.uid) } else if (this.data.content_format.indexOf('file') > -1 &&
                     this.data.content_format.indexOf('image') &&
                     this.content) { return api.getFileURL(this.data.uid) }

      return ''
    }
  }
}
</script>

<style lang="sass" scoped>
$marg: 4px

.is-thumb
  .date, .title, .description, .tags, .score
    display: none

  .post
    grid-row-end: span 2
    grid-column-end: span 2
    position: relative
    overflow: hidden

  .post
    &.w1
      grid-column-end: span 1
    &.w2
      grid-column-end: span 2
    &.w3
      grid-column-end: span 3
    &.w4
      grid-column-end: span 4
    &.w5
      grid-column-end: span 5
    &.w6
      grid-column-end: span 6
    &.h1
      grid-row-end: span 1
    &.h2
      grid-row-end: span 2
    &.h3
      grid-row-end: span 3
    &.h4
      grid-row-end: span 4
    &.h5
      grid-row-end: span 5
    &.h6
      grid-row-end: span 6

    @media screen and (max-width: 1280px)
      &.w1, &.w2
        grid-column-end: span 2
      &.w3, &.w4
        grid-column-end: span 4
      &.w5, &.w6
        grid-column-end: span 6
      &.h1, &.h2
        grid-row-end: span 2
      &.h3, &.h4
        grid-row-end: span 4
      &.h5, &.h6
        grid-row-end: span 6

    @media screen and (max-width: 960px)
      &.w1, &.w2, &.w3
        grid-column-end: span 3
      &.w4, &.w5, &.w6
        grid-column-end: span 6
      &.h1, &.h2, &.h3
        grid-row-end: span 3
      &.h4, &.h5, &.h6
        grid-row-end: span 6

    @media screen and (max-width: 512px)
      &.w1, &.w2, &.w3, &.w4, &.w5, &.w6
        grid-column-end: span 12

      &.w1.h1, &.w2.h2, &.w3.h3, &.w4.h4, &.w5.h5, &.w6.h6
        grid-row-end: span 12
      &.w1.h2, &.w2.h4, &.w3.h6
        grid-row-end: span 24
      &.w1.h3, &.w2.h6
        grid-row-end: span 36
      &.w1.h5
        grid-row-end: span 60

      &.w2.h1, &.w4.h2, &.w6.h3
        grid-row-end: span 6
      &.w3.h1, &.w6.h2
        grid-row-end: span 4
      &.w5.h1
        grid-row-end: span 2

  .thumb
    position: absolute
    background-size: cover
    background-position: center center
    background-color: whitesmoke
    top: 0
    left: 0
    width: 100%
    height: 100%
    transition: opacity 1s, transform 1s cubic-bezier(.18,0,.12,.99)

  .post:hover
    .thumb
      transform: scale(1.05) translateZ(0)
      cursor: pointer

// .thumbfade-enter-active, .thumbfade-leave-active
//     transition: opacity 1s

.thumbfade-enter, .thumbfade-leave-to
  opacity: 0
  transform: translateZ(0)

.is-text
  .post
    display: flex
    justify-content: space-between
    margin-bottom: 4px
    font-weight: normal
    text-decoration: none
    color: #363

  .post:hover
    cursor: pointer
    .title
      text-decoration: underline

  .date, .thumb
    display: none

  .title
    margin: $marg 16px
    font-size: 1em
    white-space: nowrap
    padding: 0

  .description
    margin: $marg
    font-size: 1em
    overflow: hidden
    white-space: nowrap
    margin-right: auto

  .tags
    list-style: none
    display: flex
    padding: 0
    margin: 0

    .tag
      margin-left: 8px
      background-color: #FFF
      padding: $marg
      white-space: nowrap

  .score
    margin: $marg 16px
</style>
