<template>
  <main id="app">
    <header class="header">
      <h1 class="title">Inspire</h1>
      <User :adminPage="authRequired" />
    </header>

    <nav class="nav">
      <router-link :to="{ name: 'items' }" class="link">Items</router-link>
      <router-link :to="{ name: 'adminItems' }" class="link">Admin</router-link>
      <router-link :to="{ name: 'groups' }" class="link">Groups</router-link>
      <router-link :to="{ name: 'adminImport' }" class="link">Import</router-link>
    </nav>

    <router-view />

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
