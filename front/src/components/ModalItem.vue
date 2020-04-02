<template>
  <Modal :is-open="hash !== ''" @close="setHash('')">
    <Loader v-if="!item" />
    <template v-else>
      <ItemDetails v-if="!edit" :item="item" />
      <AdminItemForm
        v-else
        :item="item"
        :create="false"
        @cancel="setHash('')"
      ></AdminItemForm>
      <button v-if="$store.getters.isLogged && !edit" @click="edit = true">Edit</button>
    </template>

  </Modal>
</template>

<script>
import Modal from '@/components/Modal.vue'
import ItemDetails from '@/components/ItemDetails.vue'
import Loader from '@/components/Loader.vue'
import api from '@/pure/api'

export default {
  components: {
    Modal,
    Loader,
    ItemDetails,
    AdminItemForm: () => import(/* webpackChunkName: "admin" */ './AdminItemForm')
  },

  data () {
    return {
      hash: '',
      edit: false,
      item: null
    }
  },

  watch: {
    hash: {
      immediate: true,
      handler (hash) {
        this.loading = true
        this.edit = false

        if (hash) {
          api
            .getItem(hash)
            .then(item => {
              this.item = item
            })
            .catch(console.error)
            .finally(() => {
              this.loading = false
            })
        } else {
          this.item = null
        }
      }
    }
  },

  created () {
    window.addEventListener('hashchange', this.onHash)
    this.onHash()
  },

  destroyed () {
    window.removeEventListener('hashchange', this.onHash)
  },

  methods: {
    setHash (hash) {
      this.$router.push({
        name: this.$route.name,
        params: this.$route.params,
        hash: hash ? '#' + hash : ''
      })
      this.onHash()
    },

    onHash () {
      const hash = window.location.hash
      this.hash = hash.replace(/^#/, '')
    }
  }
}
</script>

<style lang="sass" scoped>
@import "../style/settings.sass"
</style>
