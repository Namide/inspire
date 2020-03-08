<template>
  <div class="posts" :class="[ 'is-' + displayMode ]">
    <Post v-for="post of posts" :key="post.id" :data="post" :display-mode="displayMode"></Post>
  </div>
</template>

<script>
// import apiGet from '../utils/apiGet'
import Post from '@/components/Post.vue'
import api from '@/pure/api'

export default
{
  components: {
    Post
  },

  props: {
    filterTypes: { type: Array, default: function () { return [] } },
    filterTags: { type: Array, default: function () { return [] } }
  },

  data () {
    return {
      displayMode: 'thumb',
      posts: []
    }
  },

  // computed: {
  //   posts () {
  //     return this.$store.state.posts
  //   }
  // },

  watch: {
    filterTags (list) {
      const tags = []
      const types = []
      const noTags = []
      const noTypes = []
      list.forEach(item => {
        const s = item[0] + item[1]
        const f = item[0]

        if (s === '!@' || s === '@!') { noTypes.push(item.substr(2)) } else if (f === '@') { types.push(item.substr(1)) } else if (f === '!') { noTags.push(item.substr(1)) } else { tags.push(item) }
      })

      this.$store.dispatch('getPosts', { tags, noTags, types, noTypes })
      // apiGet.getPosts(this.onPosts, { tags, noTags, types, noTypes })
    }
  },

  created () {
    // this.$store.dispatch('getPosts')
    // apiGet.getPosts(this.onPosts)

    api.getPosts()
      .then(posts => posts.map(posts => posts.getObject()))
      .then(posts => {
        this.posts = posts
      })
  },

  methods: {
    onPosts ({ data, meta }) {
      this.displayMode = 'thumb'
      this.$store.commit('updatePosts', data)
    }
  }
}
</script>

<style lang="sass" scoped>
// http://www.competa.com/blog/css-grid-layout-metro-design-blocks/

.posts
  &.is-thumb
    --gutter: 8px
    --columns: 12
    --width: 100vw

    display: grid
    grid-template-columns: repeat(var(--columns), 1fr)
    grid-gap: var(--gutter)
    padding: var(--gutter)
    // grid-auto-rows: minmax(100px, auto)
    align-content: start
    grid-auto-rows: calc( ( var(--width) - (var(--gutter) * (var(--columns) - 1))) / var(--columns))
    grid-auto-flow: dense // dense

    background-color: #777

// @media screen and (max-width: 2048px)
//     &.is-thumb
//         --columns: 8

// @media screen and (max-width: 1280px)
//     &.is-thumb
//         --columns: 6

// @media screen and (max-width: 1536px)
//     &.is-thumb
//         --columns: 6

// @media screen and (max-width: 1024px)
//     &.is-thumb
//         --columns: 4

// @media screen and (max-width: 512px)
//     &.is-thumb
//         --columns: 2

</style>
