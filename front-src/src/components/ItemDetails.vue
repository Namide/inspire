<template>
  <article class="item">
    <header>
      <h1 class="title bold">
        <div class="bg"></div>
        <span>{{ item.title }}</span>
      </h1>

      <p v-if="item.description" class="description">
        {{ item.description }}
      </p>
    </header>

    <Content :item="item" />

    <a
      v-if="item.types.indexOf('image') > -1 && item.content"
      :href="item.content"
      target="_blank"
      rel="noreferrer noopener nofollow"
      >{{ item.content.replace(/http:\/\/|https:\/\//, "") }}</a
    >

    <footer>
      <TagsDisplay :tags="item.tags" />

      <time class="date">
        {{ createdAt }}
      </time>
    </footer>

    <span class="score"> {{ item.score }}/5 </span>
  </article>
</template>

<script>
import Content from "@/components/Content.vue";
import TagsDisplay from "@/components/TagsDisplay.vue";

export default {
  components: {
    Content,
    TagsDisplay
  },

  props: {
    item: {
      type: Object,
      required: true
    }
  },

  // data () {
  //   return {
  //     item: null
  //   }
  // },

  computed: {
    createdAt() {
      const createdAt = new Date(this.item.createdAt);
      const now = new Date();
      if (createdAt.toLocaleDateString() === now.toLocaleDateString()) {
        return createdAt
          .toLocaleDateString("en-US", { hour12: false })
          .substring(0, 5);
      } else {
        const options = {
          day: "numeric",
          month: "short"
        };
        if (createdAt.getYear() !== new Date().getYear()) {
          options.year = "numeric";
        }
        return createdAt.toLocaleDateString("en-US", options);
      }
    }
  },

  created() {},

  mounted() {},

  methods: {}
};
</script>

<style lang="sass" scoped>
@import "../style/settings.sass"

footer
  display: flex
  justify-content: space-between
  align-items: center

  &>*:first-child
    margin-left: $margin-sm

  &>*:last-child
    margin-right: $margin-sm

.date

.score
</style>
