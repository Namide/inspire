<template>
  <Tabs :labels="['Initial', 'Render']" background="white">
    <template slot="Initial">
      <InputTextarea
        v-model="modelValue"
        @submit="submit"
        placeholder="Content (URL, markdown, HTML, embed...)"
        class="textarea"
      />
    </template>
    <template slot="Render">
      <div v-html="render" class="data">
        (Content here)
      </div>
    </template>
  </Tabs>
</template>

<script>
import marked from "marked";
import InputTextarea from "@/admin/InputTextarea.vue";
import Tabs from "@/components/Tabs";

export default {
  components: {
    InputTextarea,
    Tabs
  },

  props: {
    value: { type: String }
  },

  data() {
    return {
      modelValue: null
    };
  },

  computed: {
    render() {
      return marked(this.modelValue);
    }
  },

  watch: {
    value(value) {
      if (value !== this.modelValue) {
        this.modelValue = value;
      }
    },

    modelValue(modelValue) {
      if (modelValue !== this.value) {
        this.$emit("input", modelValue);
      }
    }
  },

  created() {
    this.modelValue = this.value;
  },

  methods: {
    submit() {
      this.$emit("submit", this.modelValue);
    }
  }
};
</script>

<style lang="sass" scoped>
.textarea
  padding: 0
  width: 100%
  border: 0
</style>
