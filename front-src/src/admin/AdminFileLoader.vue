<template>
  <div :class="['size--' + size]">
    <input
      v-if="!src"
      type="file"
      :disabled="false"
      @change="filesChange($event.target.files)"
      :accept="onlyImg ? 'image/*' : '*'"
    />
    <button v-else @click="deleteFile">Delete image</button>

    <div v-if="colors" class="colors">
      <span
        v-for="color of colors"
        class="color"
        :style="{ background: color }"
        :key="color"
      ></span>
    </div>
    <img v-if="isImg && src !== ''" :src="addAuth(src)" class="file-img" />

    <!-- <template v-else-if="colors">
      <div v-for="(data, key) of colors" :key="key + data">
        <small v-if="key === 'colors'">
          <strong>{{ key }}</strong>:
          <span v-for="color of data" class="color" :style="{ background: color }" :key="color"></span>
        </small>
        <small v-else>
          <strong>{{ key }}</strong>: {{ data }}
        </small>
      </div>
    </template> -->
  </div>
</template>

<script>
export default {
  props: {
    image: { default: null },
    // colors: { type: Array, default: () => [] },
    onlyImg: { type: Boolean, default: false },
    size: {
      type: String,
      default: "normal"
    }
  },

  data() {
    return {
      isImg: true,
      src: ""
    };
  },

  watch: {
    image: {
      immediate: true,
      handler(image, oldImage) {
        if (oldImage && oldImage.src instanceof File && this.src) {
          URL.revokeObjectURL(this.src);
          this.src = "";
        }

        if (!image) {
          this.src = "";
        } else if (image.src instanceof File) {
          this.src = URL.createObjectURL(image.src);
        } else if (image.src) {
          this.src = image.src;
        }
      }
    }
  },

  computed: {
    colors() {
      return this.image && this.image.colors
        ? this.image.colors.map(({ hexa }) => hexa)
        : [];
    }
  },

  destroyed() {
    if (this.image && this.image.src instanceof File && this.src) {
      URL.revokeObjectURL(this.src);
      this.src = "";
    }
  },

  methods: {
    filesChange([file]) {
      // const isImage = file.type.split('/').shift().toLowerCase() === 'image'
      // if (isImage) {
      //   this.imgViewer(file)
      // }

      this.$emit("change", file);
    },

    deleteFile() {
      this.$emit("change", null);
    }

    // imgViewer (file) {
    //   if (file.size > 1e9) {
    //     this.finalSrc = ''
    //     return console.warn('image too big!')
    //   }

    //   const reader = new FileReader()
    //   reader.addEventListener('load', event => {
    //     this.finalSrc = event.target.result
    //   })
    //   reader.readAsDataURL(file)
    // }
  }
};
</script>

<style lang="sass" scoped>
.colors
  display: flex

.color
  width: 16px
  height: 16px
  display: inline-block

.file-img
  max-width: 256px
  max-height: 256px
  height: auto
//   width: 256px
//   height: 256px
//   background-repeat: no-repeat
//   background-position: center
//   background-size: contain
//   background-color: #000

.size--small
  .file-img
    max-width: 64px
    max-height: 64px

  .color
    width: 8px
    height: 8px
</style>
