<template>
  <div class="tabs">
    <ul class="list-item">
      <li
        v-for="(label, i) in labels"
        :key="label"
        :class="{ 'is-selected': i === current }"
        :style="{ background: i === current ? background : '' }"
        class="item"
      >
        <button v-html="label" @click="current = i"></button>
      </li>
    </ul>
    <div class="tabs-content" :style="{ background }">
      <slot :name="labels[current]" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    labels: {
      type: Array,
      default() {
        return [];
      }
    },
    background: {
      type: String,
      default: "transparent"
    }
  },

  data() {
    return {
      current: 0
    };
  },

  created() {},

  methods: {}
};
</script>

<style lang="sass" scoped>
$spacing: 1em

.list-item
  list-style: none
  display: flex
  padding: 0
  margin: 0

  button
    background: transparent
    border: none
    padding: 0.25em 1em

  .item, &:after, &:before
    border-bottom: #888 1px solid

  &:after, &:before
    content: ""
    display: block
    position: relative

  // &:before
  //   width: $spacing

  &:after
    flex: 1

  .item
    &.is-selected
      border: #888 1px solid
      border-radius: 5px 5px 0 0
      border-bottom: 0

.tabs
  border-bottom: #888 1px solid
  margin: 1em 0

.tabs-content
  padding: $spacing
  border-left: #888 1px solid
  border-right: #888 1px solid
</style>
