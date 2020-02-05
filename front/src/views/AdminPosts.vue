<template>
  <div>

    <div>
      <button @click="isModalOpen = true">+ Add new post</button>
    </div>

    <part-admin-post v-for="post of posts" :key="post.id" :post="post"></part-admin-post>

    <!-- Modal -->
    <AdminPostModal v-if="isModalOpen" :create="true" @close="isModalOpen = false"></AdminPostModal>

  </div>
</template>

<script>
import PartAdminPost from '@/components/AdminPost.vue'
import AdminPostModal from '@/components/AdminPostModal.vue'

export default
{
  components: {
    PartAdminPost,
    AdminPostModal
  },

  props: {
    filterTypes: { type: Array, default: function () { return [] } },
    filterTags: { type: Array, default: function () { return [] } }
  },

  data () {
    return {
      isModalOpen: false,
      displayMode: 'thumb'
    }
  },

  computed: {
    posts () {
      return this.$store.state.posts
    }
  },

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
    }
  },

  created () {
    this.$store.dispatch('getPosts')
  },

  methods: {
    onPosts ({ data, meta }) {
      this.displayMode = 'text' // 'thumb' // text
      this.$store.commit('updatePosts', data)
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
