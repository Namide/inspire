<template>
  <main id="app">
    <h1 class="main-title">
      Inspire
    </h1>

    <nav class="main-nav">
      <router-link :to="{ name: 'posts' }" class="link">Posts</router-link>
      <router-link :to="{ name: 'adminPosts' }" class="link">Admin</router-link>
      <router-link :to="{ name: 'boards' }" class="link">Boards</router-link>
    </nav>

    <router-view/>
  </main>
</template>

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
