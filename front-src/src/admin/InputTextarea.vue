<template>
  <textarea
    @keydown="resizeContentRaw"
    @keyup.ctrl.enter="submit"
    ref="contentRaw"
    rows="1"
    v-model="modelValue"
    :placeholder="placeholder"
  ></textarea>
</template>

<script>
export default {
  props: {
    placeholder: { type: String },
    value: { type: String }
  },

  data() {
    return {
      modelValue: null
    };
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
        this.resizeContentRaw();
      }
    }

    // state(state)
    // {
    //     if (state !== STATE.INITIAL) {
    //         window.addEventListener('keyup', this.keyUp)
    //         window.addEventListener('resize', this.resizeContentRaw)
    //         this.resizeContentRaw()
    //     }
    // }
  },

  created() {
    this.modelValue = this.value;
  },

  mounted() {
    this.resizeContentRaw();
    window.addEventListener("resize", this.resizeContentRaw);
  },

  destroyed() {
    window.removeEventListener("resize", this.resizeContentRaw);
  },

  methods: {
    resizeContentRaw() {
      const el = this.$refs.contentRaw;
      this.$nextTick(() => {
        el.style.cssText = "height:auto; padding:0";
        el.style.cssText = "height:" + el.scrollHeight + "px";
      });
    },

    submit() {
      this.$emit("submit", this.modelValue);
    }
  }
};
</script>

<style lang="sass" scoped>
/* https://codepen.io/vsync/pen/czgrf */
textarea
  box-sizing: content-box
  overflow: hidden
  padding: 10px
  display: block
  width: calc(100% - 22px)
</style>
