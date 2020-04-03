<template>
  <ul class="tags">
    <li v-for="tag of tags" class="tag" :key="tag" :style="{ backgroundColor:bg, color: color }">
      {{ tag }}
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    bg: {
      type: String
    },
    color: {
      type: String
    },
    tags: {
      type: Array,
      default () { return [] }
    }
  }
}
</script>

<style lang="sass" scoped>
@import "../style/settings.sass"
.tags
  margin-right: $margin-sm / 2
  margin-bottom: $margin-sm / 2

.tag
  color: #000
  background-color: #CCC
  // padding: $margin-sm
  white-space: nowrap
  margin-left: $margin-sm / 2
  margin-top: $margin-sm / 2
  padding: 0.1em 0.3em 0.125em
  display: inline-block

  &:first-child
    margin-left: 0

  &:last-child
    margin-right: 0
</style>
