<template>
  <div>
    <Tags @change="filter" />
    <Loader v-if="loading" />
    <div v-else class="posts" :class="['is-' + displayMode]">
      <Post
        v-for="post of posts"
        :key="post.id"
        :data="post"
        :display-mode="displayMode"
      ></Post>
    </div>
  </div>
</template>

<script>
// import apiGet from '../utils/apiGet'
import Post from '@/components/Post.vue'
import Tags from '@/components/Tags.vue'
import api from '@/pure/api'
import Loader from '@/components/Loader.vue'

export default {
  components: {
    Post,
    Tags,
    Loader
  },

  props: {},

  data () {
    return {
      displayMode: 'thumb',
      posts: [],
      loading: false
    }
  },

  created () {
    this.filter()
  },

  methods: {
    filter (items = []) {
      this.loading = true
      api
        .getPosts(items)
        .then(posts => posts.map(post => post.getObject()))
        .then(posts => {
          this.posts = posts
        })
        .catch(console.error)
        .finally(() => {
          this.loading = false
        })
    },
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
