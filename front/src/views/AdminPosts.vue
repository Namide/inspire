<template>
  <div>
    <Tags @change="filter" />

    <div>
      <button @click="isModalOpen = true">+ Add new post</button>
    </div>

    <PartAdminPost
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

export default {
  components: {
    PartAdminPost,
    AdminPostForm,
    Modal,
    Tags
  },

  props: {
    filterTypes: {
      type: Array,
      default: function () {
        return []
      }
    },
    filterTags: {
      type: Array,
      default: function () {
        return []
      }
    }
  },

  data () {
    return {
      isModalOpen: false,
      displayMode: 'thumb',
      posts: []
    }
  },

  created () {
    this.filter()
  },

  methods: {
    filter (items = []) {
      apiSave
        .getPosts(items)
        .then(posts => posts.map(post => post.getObject()))
        .then(posts => {
          this.posts = posts
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
