<template>
  <div class="loader">
    <div class="item"></div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="sass" scoped>
.loader
  padding: 20vh

.item
  margin: 0 auto
  width: 50px
  height: 50px
  animation: 0.5s rotate linear infinite
  background: #F07

@keyframes rotate
  from
    transform: none

  to
    transform: rotate(90deg)
</style>
