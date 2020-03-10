<template>
  <div>
    <!-- Line -->
    <div v-if="insert">
      <button @click="isModalOpen = true">+ Add new post</button>
    </div>

    <div v-else @click="isModalOpen = true" class="line">
      <div>
        <strong v-if="post.title" v-html="post.title"></strong>
        <template v-if="post.types && post.types.length">
          <small v-html="type" v-for="type of post.types" :key="type"></small>
        </template>
      </div>
      <div>
        <template v-if="post.tags && post.tags.length">
          <small
            v-html="tag"
            v-for="tag of post.tags"
            class="tag"
            :key="tag"
          ></small>
        </template>
        <span
          v-if="post.date"
          v-html="
            new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          "
          class="date"
        ></span>
      </div>
    </div>

    <!-- Modal -->
    <Modal :is-open="isModalOpen" @close="isModalOpen = false">
      <AdminPostForm
        :post="post"
        :create="insert"
        @cancel="isModalOpen = false"
      ></AdminPostForm>
    </Modal>
  </div>
</template>

<script>
import AdminPostForm from '@/components/AdminPostForm.vue'
import Modal from '@/components/Modal.vue'

export default {
  components: {
    AdminPostForm,
    Modal
  },

  props: {
    post: { type: Object },
    insert: { type: Boolean, default: false }
  },

  data () {
    return {
      isModalOpen: false
    }
  },

  methods: {}
}
</script>

<style lang="sass" scoped>
.line
  padding: 0.25em 0.5em
  margin-bottom: 0.5em
  position: relative
  cursor: pointer

  &:hover
    background-color: rgba(255, 255, 255, 0.25)

    &:after
      content: "Edit"
      position: absolute
      top: 50%
      right: 1em
      transform: translateY(-50%)

  .tag
    &:after
      content: ", "

    &:last-of-type
      &:after
        content: none

  .date
    margin-left: auto

input
  border: none
</style>
