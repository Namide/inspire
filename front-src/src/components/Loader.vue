<template>
  <div class="loader" :class="'size-' + size">
    <div class="item"></div>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      default: "large"
    }
  }
};
</script>

<style lang="sass" scoped>

.item
  margin: 0 auto
  animation: 0.5s rotate linear infinite
  background: #F07

.size-large
  &.loader
    padding: 20vh

  .item
    width: 50px
    height: 50px

.size-small
  .item
    width: 16px
    height: 16px


@keyframes rotate
  from
    transform: none

  to
    transform: rotate(90deg)
</style>
