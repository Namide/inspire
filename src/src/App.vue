<template>
  <main id="app">
    <header class="header">
      <router-link class="title black" :to="{ name: 'home' }">
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

    <ModalItem />

  </main>
</template>

<script>
import api from '@/pure/api'
import ModalItem from '@/components/ModalItem.vue'

const User = () => import(/* webpackChunkName: "admin" */ '@/components/User')

export default {
  components: {
    User,
    ModalItem
  },

  data () {
    return {
    }
  },

  computed: {
    authRequired () {
      return this.$route.meta.auth
    }
  },

  created () {
    api.onLogin.add(this.setLogged)
    api.isLoggedIn()
  },

  destroyed () {
    api.onLogin.remove(this.setLogged)
  },

  methods: {
    setLogged (data) {
      console.log(data)
      const getUser = data => ({
        nick: data.firstName + ' ' + data.lastName,
        image: data.avatar
      })

      const user = data ? getUser(data) : null
      this.$store.commit('user', user)
    }
  }
}
</script>

<style lang="sass" scoped>
@import "./style/settings.sass"

.header
  display: flex
  align-items: center
  padding: 0 $margin-sm
  background: #000

.title
  text-transform: uppercase
  margin-right: auto
  text-decoration: none

.nav
  text-align: center
  margin: $margin-sm * 3 0

.link
  display: inline-block
  margin: 0
  padding: $margin-sm / 4 $margin-sm

  &.router-link-active
    background: #F07
    color: #FFF
</style>
