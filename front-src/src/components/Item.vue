<template>
  <router-link :to="to" class="item" :class="classData" :style="itemStyle">
    <img
      v-if="item.image"
      :src="item.image.src"
      :srcset="item.image.srcset"
      :width="item.image.width"
      :height="item.image.height"
      :alt="item.image.alt"
      @load="() => (isThumbLoaded = true)"
      class="thumb"
      :class="{ 'is-show': showThumb && isThumbLoaded }"
    />

    <Play
      v-if="isVideo"
      class="play"
      :color="colors[2].hex"
      :bg="`rgba(${colors[3].r},${colors[3].g},${colors[3].b}, 0.75)`"
    />
    <Cube
      v-if="is3D"
      class="play"
      :color1="colors[0].hex"
      :color2="colors[1].hex"
      :color3="colors[2].hex"
      :bg="`rgba(${colors[3].r},${colors[3].g},${colors[3].b}, 0.75)`"
    />

    <h1 v-if="item.title" class="title bold" :style="{ color: colors[1].hex }">
      <div class="bg" :style="{ background: colors[0].hex }"></div>
      <span>{{ item.title }}</span>
    </h1>

    <time class="date">
      {{ item.date }}
    </time>

    <p class="description">
      {{ item.description }}
    </p>

    <TagsDisplay :tags="item.tags" :bg="colors[3].hex" :color="colors[2].hex" />

    <span class="score"> {{ item.score }}/5 </span>
  </router-link>
</template>

<script>
import Play from "@/components/Play.vue";
import Cube from "@/components/Cube.vue";
import TagsDisplay from "@/components/TagsDisplay.vue";
// import api from '@/pure/api'

const getPgcd = (a, b) => {
  while (b > 0) {
    var r = a % b;
    a = b;
    b = r;
  }

  return a;
};

export default {
  components: {
    Play,
    Cube,
    TagsDisplay
  },

  props: {
    item: { type: Object },
    displayMode: { type: String, default: "text" }
  },

  data() {
    return {
      displayImage: false,
      classData: [],
      itemStyle: {},
      showThumb: false,
      isThumbLoaded: false,
      // href: false,
      w: 1,
      h: 1
    };
  },

  computed: {
    size() {
      if (this.item.image) {
        return [this.item.image.width, this.item.image.height];
      }

      return [3, 1];
    },

    isVideo() {
      return this.item.types.indexOf("video") > -1;
    },

    is3D() {
      return this.item.types.indexOf("3d") > -1;
    },

    to() {
      return { name: this.$route.name, params: { itemID: this.item.id } };
    },

    colors() {
      const dist = (a, b) =>
        Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b);
      const detail = color => {
        const hex = Number("0x" + color.substring(1));
        return {
          hex: color,
          r: (hex >> 16) & 0xff,
          g: (hex >> 8) & 0xff,
          b: (hex >> 0) & 0xff
        };
      };
      const colors = this.item.colors.map(detail);
      const colorsFallback = ["#FFFFFF", "#000000", "#555555", "#AAAAAA"];
      while (colors.length < 4) {
        colors.push(detail(colorsFallback.shift()));
      }

      const a = colors.shift();
      const b = colors.shift();

      colors.sort((c1, c2) => dist(a, c1) - dist(a, c2));
      const c = colors.pop();

      colors.sort((c1, c2) => dist(b, c1) - dist(b, c2));
      const d = colors.pop();

      return [a, c, b, d];
    }
  },

  created() {
    const size = this.size;

    const max = 6;
    let w = 1;
    let h = 1;
    if (size[0] > size[1]) {
      w = max;
      h = Math.round((w * size[1]) / size[0]) || 1;
    } else {
      h = max;
      w = Math.round((h * size[0]) / size[1]) || 1;
    }

    const p = getPgcd(w, h);
    w /= p;
    h /= p;

    this.setSize(w, h);

    if (this.item.image && this.displayMode === "thumb") {
      this.$set(
        this.itemStyle,
        "background-color",
        this.item.colors && this.item.colors[0]
          ? this.item.colors[0]
          : "rgba(0,0,0,0)"
      );
    }

    // if (
    //   this.displayMode === 'text' &&
    //   this.item.content_format.indexOf('URL') > -1
    // ) {
    //   this.href = this.item.content.URL
    // }
  },

  mounted() {
    if (this.item.image) {
      this.optimizeLoad();
    }
  },

  methods: {
    optimizeLoad() {
      const options = {
        root: null,
        rootMargin: "0px",
        threshold: [0, 1]
      };

      this._observer = new IntersectionObserver(this.onInOut, options);
      this._observer.observe(this.$el);
    },

    onInOut(data) {
      if (data[0].intersectionRatio > 0) {
        this.showThumb = true;
      } else {
        this.showThumb = false;
      }
    },

    setSize(w = 1, h = 1) {
      const areaMax = 12;
      const areaMin = 4;
      const areaDo = this.item.score * (areaMax - areaMin) + areaMin;

      const sideMax = 6;

      let mult = 5;
      while (
        w * (mult + 1) * h * (mult + 1) <= areaDo &&
        Math.max(w * mult + 1, h * mult + 1) < sideMax
      ) {
        mult++;
      }
      while (Math.max(w * mult, h * mult) > sideMax) {
        mult--;
      }

      w *= mult;
      h *= mult;

      this.classData.push("w" + w, "h" + h);
    }
  }
};
</script>

<style lang="sass" scoped>
@import "../style/settings.sass"

$marg: $margin-sm

.is-thumb
  .item
    cursor: pointer

  .date, .description, .score
    display: none

  .item
    grid-row-end: span 2
    grid-column-end: span 2
    position: relative
    overflow: hidden

  .item
    @for $i from 1 through 6
      &.w#{$i}
        grid-column-end: span #{$i}

      &.h#{$i}
        grid-row-end: span #{$i}

    @media screen and (max-width: 1280px)
      @for $i from 0 through 2
        &.w#{$i * 2 + 1}, &.w#{($i + 1) * 2}
          grid-column-end: span #{($i + 1) * 2}

        &.h#{$i * 2 + 1}, &.h#{($i + 1) * 2}
          grid-row-end: span #{($i + 1) * 2}

    @media screen and (max-width: 960px)
      &.w1, &.w2, &.w3
        grid-column-end: span 3
      &.w4, &.w5, &.w6
        grid-column-end: span 6
      &.h1, &.h2, &.h3
        grid-row-end: span 3
      &.h4, &.h5, &.h6
        grid-row-end: span 6

    @media screen and (max-width: 512px)
      &.w1, &.w2, &.w3, &.w4, &.w5, &.w6
        grid-column-end: span 12

      &.w1.h1, &.w2.h2, &.w3.h3, &.w4.h4, &.w5.h5, &.w6.h6
        grid-row-end: span 12
      &.w1.h2, &.w2.h4, &.w3.h6
        grid-row-end: span 24
      &.w1.h3, &.w2.h6
        grid-row-end: span 36
      &.w1.h5
        grid-row-end: span 60

      &.w2.h1, &.w4.h2, &.w6.h3
        grid-row-end: span 6
      &.w3.h1, &.w6.h2
        grid-row-end: span 4
      &.w5.h1
        grid-row-end: span 2

  .thumb, .title, .tags
    transition: opacity 0.5s, transform 0.6s cubic-bezier(.18,0,.12,.99)

  .thumb
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    object-fit: cover
    opacity: 0

    &.is-show
      opacity: 1

  .tags
    position: absolute
    bottom: $margin-sm
    left: $margin-sm
    right: $margin-sm
    text-align: right

  .title
    position: absolute
    top: 0
    left: 0
    right: 0
    display: block

    span
      margin: $margin-sm
      display: block
      text-align: left
      position: relative

    .bg
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      opacity: 0.75

  .play
    position: absolute
    top: 50%
    left: 50%
    transform: translateX(-50%) translateY(-50%)
    transition: opacity 0.5s, transform 0.6s cubic-bezier(.18,0,.12,.99)

  .item:hover
    .thumb
      transform: scale(1.025)

    .title
      transform: translateY(-10px)
      opacity: 0

    .tags
      transform: translateY(10px) translateX(2px)
      opacity: 0

    .play
      transform: translateX(-50%) translateY(-50%) scale(1.15)

.is-text
  .item
    display: flex
    justify-content: space-between
    margin-bottom: 4px
    text-decoration: none
    color: #363

  .item:hover
    cursor: pointer

    .title
      text-decoration: underline

  .date, .thumb
    display: none

  .title
    margin: $marg 16px
    font-size: 1em
    white-space: nowrap
    padding: 0

  .description
    margin: $marg
    font-size: 1em
    overflow: hidden
    white-space: nowrap
    margin-right: auto

  .score
    margin: $marg 16px
</style>
