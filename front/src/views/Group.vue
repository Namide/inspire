<template>
  <div>
    <h2>{{ group.title }}</h2>
    <p>{{ group.description }}</p>
    <Items :filter="filter" />
  </div>
</template>

<script>
import Items from '@/views/Items.vue'

export default {
  components: {
    Items
  },

  props: {
    group: {
      type: Object
    }
  },

  computed: {
    filter () {
      return this.group.filter.split(',')
    }
  },

  data () {
    return {
      displayMode: 'thumb',
      loading: false
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
