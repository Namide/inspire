<template>
  <svg
    x="0px"
    y="0px"
    :width="width"
    :height="height"
    viewBox="0 0 496.158 496.158"
    xml:space="preserve"
  >
    <path
      :style="{ fill: bg }"
      d="M496.158,248.085c0-137.021-111.07-248.082-248.076-248.082C111.07,0.002,0,111.062,0,248.085       c0,137.002,111.07,248.071,248.083,248.071C385.088,496.155,496.158,385.086,496.158,248.085z"
      id="path2"
      style="fill:#999999" />
    <path
      :style="{ fill: color1 }"
      style="fill-opacity:1;stroke-width:11.22167206;stroke-miterlimit:4;stroke-dasharray:none"
      d="m 247.1319,116.26667 c -13.40556,0 -109.39292,55.41975 -116.0957,67.0293 -6.70278,11.60956 -6.70278,122.44513 0,134.05469 6.70278,11.60955 102.69014,67.02734 116.0957,67.02734 0.22369,0 0.47332,-0.0165 0.74219,-0.0469 V 116.3155 c -0.26887,-0.0304 -0.5185,-0.0488 -0.74219,-0.0488 z"
    />
    <path
      :style="{ fill: color2 }"
      style="fill-opacity:1;stroke-width:9.63624096;stroke-miterlimit:4;stroke-dasharray:none"
      d="m 247.87409,116.3155 v 268.01563 c 15.84477,-1.7914 108.76063,-55.56463 115.35156,-66.98047 6.70278,-11.60956 6.70278,-122.44513 0,-134.05469 -6.59093,-11.41584 -99.50679,-65.18907 -115.35156,-66.98047 z"
    />
    <path
      :style="{ fill: color3 }"
      style="fill-opacity:1;stroke-width:8.78657627;stroke-miterlimit:4;stroke-dasharray:none"
      d="m 247.1319,116.26667 c -13.397,0 -109.26775,55.34787 -116.08007,67.00586 l 114.90234,70.14258 116.53906,-71.14258 C 351.46991,168.77426 260.18143,116.26667 247.1319,116.26667 Z"
    />
  </svg>
</template>

<script>
export default {
  props: {
    bg: { type: String, default: '#FFF' },
    color1: { type: String, default: '#F07' },
    color2: { type: String, default: '#07F' },
    color3: { type: String, default: '#7F0' },
    width: { type: Number, default: 64 },
    height: { type: Number, default: 64 }
  }
}
</script>

<style lang="sass" scoped>
</style>
