<template>
  <div>
    <Tags @change="filter" />

    <div>
      <button @click="isModalOpen = true">+ Add new item</button>
    </div>

    <Loader v-if="loading" />

    <PartAdminItem
      v-else
      v-for="item of items"
      :key="item.id"
      :item="item"
    ></PartAdminItem>

    <!-- Modal -->

    <Modal :is-open="isModalOpen" @close="isModalOpen = false">
      <AdminItemForm
        :create="true"
        @cancel="isModalOpen = false"
      ></AdminItemForm>
    </Modal>
  </div>
</template>

<script>
import Tags from '@/components/Tags.vue'
import PartAdminItem from '@/components/AdminItem.vue'
import AdminItemForm from '@/components/AdminItemForm.vue'
import Modal from '@/components/Modal.vue'
import apiSave from '@/pure/apiSave'
import Loader from '@/components/Loader.vue'

export default {
  components: {
    PartAdminItem,
    AdminItemForm,
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
      items: [],
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
        .getItems(items)
        .then(items => {
          this.items = items
        })
        .catch(console.error)
        .finally(() => {
          this.loading = false
        })
    },
    onItems ({ data, meta }) {
      this.displayMode = 'text' // 'thumb' // text
      this.$store.commit('updateItems', data)
    }
  }
}
</script>

<style lang="sass" scoped></style>
