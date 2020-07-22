<template>
  <div
    class="content"
    :class="['is-' + mainType, invRatio !== '' ? 'has-ratio' : '']"
  >
    <div v-if="invRatio" class="dummy" :style="{ paddingTop: invRatio }"></div>

    <img
      v-if="mainType === TYPES.IMAGE"
      :src="src"
      :srcset="item.image.srcset"
      :width="item.image.width"
      :height="item.image.height"
      :alt="item.image.alt"
      class="image"
    />
    <video v-else-if="mainType === TYPES.VIDEO" controls class="video">
      <source :src="src" :type="item.file.type" />
    </video>
    <div v-else v-html="html" class="data">
      (Content here)
    </div>
  </div>
</template>

<script>
import { TYPES } from "../../../web/app/constants/items";

export default {
  props: {
    item: {
      type: Object
    }
  },

  data() {
    return {
      TYPES: JSON.parse(JSON.stringify(TYPES)),
      src: ""
    };
  },

  destroyed() {
    if (this._toBeDestroyed) {
      this._toBeDestroyed.forEach(call => call());
      delete this._toBeDestroyed;
    }
  },

  watch: {
    item: {
      immediate: true,
      handler(item) {
        const srcOrFile =
          (item.image && item.image.src) || (item.file && item.file.src) || "";

        if (srcOrFile instanceof File) {
          const src = URL.createObjectURL(srcOrFile);
          console.log(src);
          if (!this._toBeDestroyed) {
            this._toBeDestroyed = [];
          }
          this._toBeDestroyed.push(() => URL.revokeObjectURL(src));
          this.src = src;
        } else {
          this.src = this.addAuth(srcOrFile);
        }
      }
    }
  },

  computed: {
    mainType() {
      if (this.item.types) {
        if (this.item.types.indexOf(TYPES.EMBED) > -1) {
          return TYPES.EMBED;
        } else if (this.item.types.indexOf(TYPES.URL) > -1) {
          return TYPES.URL;
        } else if (this.item.types.indexOf(TYPES.VIDEO) > -1) {
          return TYPES.VIDEO;
        } else if (this.item.types.indexOf(TYPES.IMAGE) > -1) {
          return TYPES.IMAGE;
        }
      }

      return TYPES.TEXT;
    },

    html() {
      if (this.mainType === TYPES.EMBED) {
        return this.item.content;
      } else if (this.mainType === TYPES.URL) {
        return (
          '<a href="' +
          this.item.content +
          '" target="_blank" rel="noreferrer noopener nofollow">' +
          this.item.content.replace(/http:\/\/|https:\/\//, "") +
          "</a>"
        );
      } else if (this.mainType === TYPES.TEXT) {
        return this.item.content;
      }

      return "type not know";
    },

    invRatio() {
      if (this.mainType === TYPES.EMBED) {
        if (this.item.content.trim().match(/<iframe(.+)<\/iframe>/g) !== null) {
          // const regExS = /<iframe[^>]+src=["']?(.+?)["'\s>]/gi
          const regExW = /<iframe[^>]+width=["']?(\d+%?)/gi;
          const regExH = /<iframe[^>]+height=["']?(\d+%?)/gi;

          // const exS = regExS.exec(raw)
          const exW = regExW.exec(this.item.content);
          const exH = regExH.exec(this.item.content);

          // const src = exS && exS.length > 1 ? exS[1] : null
          const width = exW && exW.length > 1 ? exW[1] || 640 : 640;
          const height = exH && exH.length > 1 ? exH[1] || 360 : 360;

          if (width && height) {
            return (100 * height) / width + "%";
          }
        }

        return "56.25%";
      }

      return "";
    }
  }
};
</script>

<style lang="sass" scoped>
.content
  position: relative

.image, .video
  display: block
  margin: 0 auto
  max-width: 100%
  height: auto

.has-ratio
  .data
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%

    &>::v-deep *
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      border: 0

.dummy
  width: 100%
</style>
