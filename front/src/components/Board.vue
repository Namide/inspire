<template>
  <article>
    <h1>
      {{ data.title }}
    </h1>
    <p>
      {{ data.description }}
    </p>
    <ul>
      <li v-for="type of data.types">
        {{ type }}
      </li>
    </ul>
    <ul>
      <li v-for="tag of data.tags">
        {{ tag }}
      </li>
    </ul>
    <ul>
      <li v-for="tag of data.excluded">
        {{ tag }}
      </li>
    </ul>
    <Asset :data="data.thumb"></Asset>
  </article>
</template>

<script>
import Asset from '@/components/Asset.vue'

export default {
  components: {
    Asset
  },

  props: {
    data: { type: Object }
  },

  data () {
    return {
      posts: []
    }
  },

  created () {

  },

  methods: {
  }
}
</script>

<style lang="sass" scoped>
</style>
