<template>
  <div class="tasks">
    <Task
      :title="title"
      :description="description"
      :id="id"
      v-for="{ id, title, description } of $tasks.list"
      :key="id"
    />
  </div>
</template>

<script>
import Task from "@/admin/Task.vue";

export default {
  components: {
    Task
  },

  data() {
    return {};
  },

  computed: {},

  methods: {}
};
</script>

<style lang="sass" scoped>
@import "../style/settings.sass"

.tasks
  position: fixed
  bottom: 0
  right: 0
</style>
