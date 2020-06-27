<template>
  <div class="task">
    <strong>{{ title }}</strong>
    <p>{{ description }}</p>
    <button @click="valid">Valid</button>
    <button @click="cancel">Cancel</button>
  </div>
</template>

<script>
import tasksManager from "@/pure/tasksManager";

export default {
  components: {},

  props: {
    id: { type: Number, required: true },
    title: { type: String, default: "" },
    description: { type: String, default: "" }
  },

  computed: {},

  methods: {
    valid() {
      tasksManager.exec(this.id);
    },

    cancel() {
      tasksManager.remove(this.id);
    }
  }
};
</script>

<style lang="sass" scoped>
@import "../style/settings.sass"
</style>
