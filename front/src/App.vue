<template>
  <main id="app">
    <header class="header">
      <router-link class="title" :to="{ name: 'home' }">
        <h1>Inspire</h1>
      </router-link>
      <User :adminPage="authRequired" />
    </header>

    <nav class="nav">
      <router-link :to="{ name: 'items' }" class="link">Items</router-link>
      <router-link :to="{ name: 'adminItems' }" class="link">Admin</router-link>
      <router-link :to="{ name: 'groups' }" class="link">Groups</router-link>
      <router-link :to="{ name: 'adminImport' }" class="link">Import</router-link>
    </nav>

    <router-view />

    <Modal :is-open="hash !== ''" @close="setHash('')">
      <ItemDetails v-if="hash" :id="hash" />
    </Modal>

  </main>
</template>

<script>
import Modal from '@/components/Modal.vue'
import ItemDetails from '@/components/ItemDetails.vue'

const User = () => import(/* webpackChunkName: "admin" */ '@/components/User')

export default {
  components: {
    User,
    Modal,
    ItemDetails
  },

  data () {
    return {
      hash: ''
    }
  },

  computed: {
    authRequired () {
      return this.$route.meta.auth
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
@import "./style/settings.sass"

.header
  display: flex
  align-items: center
  padding: $margin-sm

.title
  font-weight: bold
  text-transform: uppercase
  margin-right: auto

.nav
  text-align: center

.link
  display: inline-block
  margin: 0 0.4em
</style>
