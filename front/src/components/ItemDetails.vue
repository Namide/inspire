<template>
  <div
    class="item"
  >
    <h1 class="title bold">
      <div class="bg"></div>
      <span>{{ item.title || 'Test de titre avec quelques mots' }}</span>
    </h1>

    <!-- <img
      v-if="item.image"
      :src="item.image.src"
      :srcset="item.image.srcset"
      :width="item.image.width"
      :height="item.image.height"
      :alt="item.image.alt"
      @load="() => (isThumbLoaded = true)"
      class="thumb"
      :class="{ 'is-show': showThumb && isThumbLoaded }"
    /> -->
    <Content v-if="item.content" :type="mainType" :content="item.content" />

    <time class="date">
      {{ item.date }}
    </time>

    <p class="description">
      {{ item.description }}
    </p>

    <ul class="tags">
      <li v-for="tag of item.tags" class="tag" :key="tag">
        {{ tag }}
      </li>
    </ul>

    <span class="score"> {{ item.score }}/5 </span>
  </div>
</template>

<script>
import Content from '@/components/Content.vue'
import api from '@/pure/api'

export default {
  components: {
    Content
  },

  props: {
    id: {
      type: String,
      required: true
    }
  },

  watch: {
    id: {
      immediate: true,
      handler (id) {
        this.loading = true
        api
          .getItem(id)
          .then(item => item.getObject())
          .then(item => {
            this.item = item
          })
          .catch(console.error)
          .finally(() => {
            this.loading = false
          })
      }
    }
  },

  data () {
    return {
      item: { }
    }
  },

  computed: {
    mainType () {
      if (this.item.types) {
        if (this.item.types.indexOf('embed') > -1) {
          return 'embed'
        } else if (this.item.types.indexOf('url') > -1) {
          return 'url'
        }
      }

      return 'text'
    }
  },

  created () {
  },

  mounted () {

  },

  methods: {

  }
}
</script>

<style lang="sass" scoped>
@import "../style/settings.sass"

</style>
