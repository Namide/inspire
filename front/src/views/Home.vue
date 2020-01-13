<template>
  <div>
    <h2>Home page</h2>
    <Tags @update:tags="onFiltered"></Tags>
    <Posts :filter-tags="filterTags"></Posts>
  </div>
</template>

<script>
import Posts from '@/views/Posts.vue'
import Tags from '@/components/Tags.vue'
// import extractColors from 'extract-colors'

export default
{
  components: {
    Posts,
    Tags
  },

  data () {
    return {
      filterTags: [],
      tags: []
    }
  },

  created () {
    // const display = (colors, src) => {
    //   const image = new Image()
    //   image.src = src
    //   image.height = 200
    //   image.style.width = 'auto'
    //   document.body.appendChild(image)

    //   const canvas = document.createElement('canvas')
    //   canvas.width = 20
    //   canvas.height = image.height

    //   const context = canvas.getContext('2d')

    //   var imageData = context.createImageData(canvas.width, canvas.height)
    //   var pixels = imageData.data

    //   /* eslint no-labels: "off" */
    //   loop: for (var r = 0; r < imageData.height; r++) {
    //     for (var c = 0; c < imageData.width; c++) {
    //       const i = Math.floor(r / canvas.width)

    //       const color = colors[i]

    //       if (!color) { break loop }

    //       // Calculate the position of the current pixel in the array
    //       var pos = (r * (imageData.width * 4)) + (c * 4)

    //       // Assign the colour to each pixel
    //       pixels[pos + 0] = color.red
    //       pixels[pos + 1] = color.green
    //       pixels[pos + 2] = color.blue
    //       pixels[pos + 3] = 255
    //     }
    //   }

    //   context.putImageData(imageData, 0, 0)

    //   document.body.appendChild(canvas)
    // }

    // console.log(require('../assets/namide-world.jpg'))
    // extractColors(require('../assets/namide-world.jpg'))
    //   .then(colors => {
    //     display(colors, require('../assets/namide-world.jpg'))
    //     console.log(colors)
    //   })
    //   .catch(console.log)

    // console.log(require('../assets/3.jpg'))
    // extractColors(require('../assets/3.jpg'))
    //   .then(colors => {
    //     display(colors, require('../assets/3.jpg'))
    //     console.log(colors)
    //   })
    //   .catch(console.log)

    // extractColors(require('../assets/4.jpg'))
    //   .then(colors => {
    //     display(colors, require('../assets/4.jpg'))
    //     console.log(colors)
    //   })

    // extractColors(require('../assets/2.jpg'))
    //   .then(colors => {
    //     display(colors, require('../assets/2.jpg'))
    //     console.log(colors)
    //   })

    // extractColors(require('../assets/1.jpg'))
    //   .then(colors => {
    //     display(colors, require('../assets/1.jpg'))
    //     console.log(colors)
    //   })

    // extractColors(require('../assets/made-in-abyss-cover-1.jpg'))
    //   .then(colors => {
    //     display(colors, require('../assets/made-in-abyss-cover-1.jpg'))
    //     console.log(colors)
    //   })

    // extractColors(require('../assets/made-in-abyss-cover-2.jpg'))
    //   .then(colors => {
    //     display(colors, require('../assets/made-in-abyss-cover-2.jpg'))
    //     console.log(colors)
    //   })

    // extractColors(require('../assets/made-in-abyss-cover-3.jpg'))
    //   .then(colors => {
    //     display(colors, require('../assets/made-in-abyss-cover-3.jpg'))
    //     console.log(colors)
    //   })

    // extractColors(require('../assets/made-in-abyss-cover-4.jpg'))
    //   .then(colors => {
    //     display(colors, require('../assets/made-in-abyss-cover-4.jpg'))
    //     console.log(colors)
    //   })
  },

  methods: {
    onFiltered (tags) {
      this.filterTags.splice(0, this.filterTags.length, ...tags)
    }
  }
}
</script>
