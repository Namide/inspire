<template>
  <div>
    <img
      v-if="isImg()"
      :width="data.width"
      :height="data.height"
      :src="data.url"
      :alt="data.title"
    />
  </div>
</template>

<script>
export default {
  components: {},

  props: {
    data: { type: Object },
  },

  created() {},

  methods: {
    isImg() {
      return this.data.type === "image/jpeg";
    },
  },
};
</script>

<style lang="sass" scoped></style>
