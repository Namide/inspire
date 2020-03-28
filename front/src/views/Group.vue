<template>
  <div>
    <h2>{{ group.title }}</h2>
    <p>{{ group.description }}</p>
    <Tags :filter="filter" @change="items => filter = items" />
    <Items :filter="filter" />
  </div>
</template>

<script>
import Items from '@/components/Items.vue'
import Tags from '@/components/Tags.vue'

export default {
  components: {
    Items,
    Tags
  },

  props: {
    group: {
      type: Object
    }
  },

  data () {
    return {
      filter: [],
      displayMode: 'thumb',
      loading: false
    }
  },

  watch: {
    'group.filter': {
      immediate: true,
      handler (filter) {
        this.filter = filter.split(',')
      }
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
