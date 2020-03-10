<template>
  <div v-if="isOpen" class="modal">
    <div class="container">
      <div class="bg" @click="close"></div>
      <div class="box">
        <slot @close="$emit('close')" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},

  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },

  created () {
    window.addEventListener('keyup', this.keyUp)
  },

  destroyed () {
    window.removeEventListener('keyup', this.keyUp)
  },

  methods: {
    close () {
      this.$emit('close')
    },

    keyUp (keyEvent) {
      if (keyEvent.keyCode === 27) {
        this.close()
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.modal
  position: fixed
  left: 0
  top: 0
  width: 100%
  height: 100%
  z-index: 2
  overflow-y: auto

.container
  position: relative
  min-height: 100vh

  &:before, &:after
    content: ""
    display: block
    height: 10vw

.bg
  position: absolute
  left: 0
  top: 0
  width: 100%
  height: 100%
  background: rgba(0, 0, 0, 0.5)

.box
  position: relative
  background: #FFF
  margin: 0 10%
  z-index: 2
</style>
