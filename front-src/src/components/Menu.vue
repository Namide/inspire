<template>
  <nav class="nav">
    <router-link :to="{ name: 'items' }" class="link">Items</router-link>
    <router-link :to="{ name: 'adminItems' }" class="link">Admin</router-link>
    <!-- <router-link :to="{ name: 'groups' }" class="link">Groups</router-link> -->
    <router-link :to="{ name: 'adminImport' }" class="link">Import</router-link>
  </nav>
</template>

<script>
export default {};
</script>

<style lang="sass" scoped>
@import "../style/settings.sass"

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
