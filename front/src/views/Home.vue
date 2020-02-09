<template>
  <div>
    <h2>Home page</h2>
    <Tags @update:tags="onFiltered"></Tags>
    <Posts :filter-tags="filterTags"></Posts>
  </div>
</template>

<script>
import Posts from '@/views/Posts.vue'
import Tags from '@/components/Tags.vue'

export default
{
  components: {
    Posts,
    Tags
  },

  data () {
    return {
      filterTags: [],
      tags: []
    }
  },

  created () {
  },

  methods: {
    onFiltered (tags) {
      this.filterTags.splice(0, this.filterTags.length, ...tags)
    }
  }
}
</script>
