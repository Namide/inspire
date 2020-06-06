<template>
  <div>
    <Loader v-if="loading" />
    <div v-else class="items" :class="['is-' + displayMode]">
      <Item
        v-for="item of items"
        :key="item.id"
        :item="item"
        :display-mode="displayMode"
      ></Item>
    </div>
  </div>
</template>

<script>
// import apiGet from '../utils/apiGet'
import Item from "@/components/Item.vue";
import Loader from "@/components/Loader.vue";
import ItemsLoader from "@/mixins/ItemsLoader.js";

export default {
  mixins: [ItemsLoader],

  components: {
    Item,
    Loader
  },

  data() {
    return {
      displayMode: "thumb"
    };
  },

  methods: {
    onItems({ data, meta }) {
      console.log(data, meta);
      // this.$store.commit('updateItems', data)
    }
  }
};
</script>

<style lang="sass" scoped>
@import "../style/settings.sass"

// http://www.competa.com/blog/css-grid-layout-metro-design-blocks/

.items
  &.is-thumb
    --gutter: #{ $margin-sm }
    --columns: 12
    --width: 100vw

    display: grid
    grid-template-columns: repeat(var(--columns), 1fr)
    grid-gap: var(--gutter)
    padding: var(--gutter)
    // grid-auto-rows: minmax(100px, auto)
    align-content: start
    grid-auto-rows: calc( ( var(--width) - (var(--gutter) * (var(--columns) - 1))) / var(--columns))
    grid-auto-flow: dense // dense

    background-color: #000

// @media screen and (max-width: 2048px)
//     &.is-thumb
//         --columns: 8

// @media screen and (max-width: 1280px)
//     &.is-thumb
//         --columns: 6

// @media screen and (max-width: 1536px)
//     &.is-thumb
//         --columns: 6

// @media screen and (max-width: 1024px)
//     &.is-thumb
//         --columns: 4

// @media screen and (max-width: 512px)
//     &.is-thumb
//         --columns: 2
</style>
