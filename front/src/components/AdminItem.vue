<template>
  <div>
    <!-- Line -->
    <div v-if="insert">
      <button @click="isModalOpen = true">+ Add new item</button>
    </div>

    <div v-else @click="isModalOpen = true" class="line">
      <div>
        <strong v-if="item.title" v-html="item.title"></strong>
        <template v-if="item.types && item.types.length">
          <small v-html="type" v-for="type of item.types" :key="type"></small>
        </template>
      </div>
      <div>
        <template v-if="item.tags && item.tags.length">
          <small
            v-html="tag"
            v-for="tag of item.tags"
            class="tag"
            :key="tag"
          ></small>
        </template>
        <span
          v-if="item.date"
          v-html="
            new Date(item.date).toLocaleDateString('en-US', {
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
      <AdminItemForm
        :item="item"
        :create="insert"
        @cancel="isModalOpen = false"
      ></AdminItemForm>
    </Modal>
  </div>
</template>

<script>
import AdminItemForm from '@/components/AdminItemForm.vue'
import Modal from '@/components/Modal.vue'

export default {
  components: {
    AdminItemForm,
    Modal
  },

  props: {
    item: { type: Object },
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
