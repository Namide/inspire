<template>
  <router-link :to="{ name: 'group', params: { id: group.id } }">
    <h1>
      {{ group.title }}
    </h1>
    <p>
      {{ group.description }}
    </p>
    <!-- <ul>
      <li v-for="type of group.types" :key="type">
        {{ type }}
      </li>
    </ul>
    <ul>
      <li v-for="tag of group.tags" :key="tag">
        {{ tag }}
      </li>
    </ul>
    <ul>
      <li v-for="tag of group.excluded" :key="tag">
        {{ tag }}
      </li>
    </ul> -->
    <!-- <Asset :group="group.thumb"></Asset> -->
  </router-link>
</template>

<script>
// import Asset from '@/components/Asset.vue'

export default {
  components: {
    // Asset
  },

  props: {
    group: { type: Object }
  },

  created() {},

  methods: {}
};
</script>

<style lang="sass" scoped></style>
