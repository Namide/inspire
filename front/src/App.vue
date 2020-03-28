<template>
  <main id="app">
    <h1 class="main-title">Inspire</h1>

    <nav class="main-nav">
      <router-link :to="{ name: 'items' }" class="link">Items</router-link>
      <router-link :to="{ name: 'adminItems' }" class="link">Admin</router-link>
      <router-link :to="{ name: 'boards' }" class="link">Boards</router-link>
      <router-link :to="{ name: 'adminImport' }" class="link">Import</router-link>
    </nav>

    <router-view />

    <User :adminPage="authRequired" />
  </main>
</template>

<script>
const User = () => import(/* webpackChunkName: "admin" */ '@/components/User')

export default {
  components: {
    User
  },

  computed: {
    authRequired () {
      return this.$route.meta.auth
    }
  }
}
</script>

<style lang="sass" scoped>
.main-title
  text-align: center
  font-weight: bold
  text-transform: uppercase
  margin-top: 8vh
  margin-bottom: 1vh

.main-nav
  text-align: center

.link
  display: inline-block
  margin: 0 0.4em
</style>
