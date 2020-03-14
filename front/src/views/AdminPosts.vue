<template>
  <div>
    <Tags @change="filter" />

    <div>
      <button @click="isModalOpen = true">+ Add new post</button>
    </div>

    <Loader v-if="loading" />

    <PartAdminPost
      v-else
      v-for="post of posts"
      :key="post.id"
      :post="post"
    ></PartAdminPost>

    <!-- Modal -->

    <Modal :is-open="isModalOpen" @close="isModalOpen = false">
      <AdminPostForm
        :create="true"
        @cancel="isModalOpen = false"
      ></AdminPostForm>
    </Modal>
  </div>
</template>

<script>
import Tags from '@/components/Tags.vue'
import PartAdminPost from '@/components/AdminPost.vue'
import AdminPostForm from '@/components/AdminPostForm.vue'
import Modal from '@/components/Modal.vue'
import apiSave from '@/pure/apiSave'
import Loader from '@/components/Loader.vue'

export default {
  components: {
    PartAdminPost,
    AdminPostForm,
    Modal,
    Tags,
    Loader
  },

  props: {
    filterTypes: {
      type: Array,
      default () {
        return []
      }
    },
    filterTags: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      isModalOpen: false,
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
      apiSave
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
      this.displayMode = 'text' // 'thumb' // text
      this.$store.commit('updatePosts', data)
    }
  }
}
</script>

<style lang="sass" scoped></style>
