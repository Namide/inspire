<template>
  <div>

    <div>
      <button @click="isModalOpen = true">+ Add new post</button>
    </div>

    <PartAdminPost v-for="post of posts" :key="post.id" :post="post"></PartAdminPost>

    <!-- Modal -->

    <Modal :is-open="isModalOpen" @close="isModalOpen = false">
      <AdminPostForm :create="true" @cancel="isModalOpen = false"></AdminPostForm>
    </Modal>

  </div>
</template>

<script>
import PartAdminPost from '@/components/AdminPost.vue'
import AdminPostForm from '@/components/AdminPostForm.vue'
import Modal from '@/components/Modal.vue'
import apiSave from '@/pure/apiSave'

export default
{
  components: {
    PartAdminPost,
    AdminPostForm,
    Modal
  },

  props: {
    filterTypes: { type: Array, default: function () { return [] } },
    filterTags: { type: Array, default: function () { return [] } }
  },

  data () {
    return {
      isModalOpen: false,
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

        if (s === '!@' || s === '@!') {
          noTypes.push(item.substr(2))
        } else if (f === '@') {
          types.push(item.substr(1))
        } else if (f === '!') {
          noTags.push(item.substr(1))
        } else {
          tags.push(item)
        }
      })

      this.$store.dispatch('getPosts', { tags, noTags, types, noTypes })
    }
  },

  created () {
    // this.$store.dispatch('getPosts')
    apiSave.getPosts()
      .then(posts => posts.map(posts => posts.getObject()))
      .then(posts => {
        this.posts = posts
      })
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
