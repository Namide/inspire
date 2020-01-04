/* eslint-disable */

class colorGroup {
  constructor() {
    this.isGroup = true
    this.count = 1
    this.children = { }
  }

  getGroup(key) {
    if (this.hasKey(key)) {
      this.incKey(key)
    } else {
      this.children[key] = new colorGroup()
    }

    return this.children[key]
  }

  getColor(hex, red, green, blue) {
    if (this.hasKey(hex)) {
      this.incKey(hex)
    } else {
      this.children[hex] = new Color(hex, red, green, blue)
    }

    return this.children[hex]
  }

  incKey(key) {
    this.children[key].count++
  }

  hasKey(key) {
    return !!this.children[key]
  }

  addChild(key, child) {
    this.children[key] = child
  }

  getList() {
    return Object.keys(this.children)
      .map(key => this.children[key])
  }

  getMaxSaturation() {
    if (this.maxSaturation === undefined) {
      const list = this.getList()
        .map(child => child.isColor ? child.getSaturation() : child.getMaxSaturation())

      list.sort((a, b) => b - a)
      this.maxSaturation = list[0] || 0
    }

    return this.maxSaturation
  }

  getMaxSaturatedColor() {
    const list = this.getList()
    list.sort((a, b) => a.isColor ? b.getSaturation() - a.getSaturation() : (b.getMaxSaturation() - a.getMaxSaturation()))
    
    return list[0].isColor ? list[0] : list[0].getMaxSaturatedColor()
  }

  getColorsByMaxSaturation() {
    const list = this.getList()
      .map(child => {
        const count = child.count
        const color = child.getMaxSaturatedColor()
        color.count = count
        return color
      })
    
    list.sort((a, b) => b.getSaturation() - a.getSaturation())
    return list
  }

  getColors(countWeight = 0.5, saturationWeight = 0.5) {
    
  }
}

class Color {
  constructor (hex, red, green, blue) {
    this.isColor = true

    this.red = red
    this.green = green
    this.blue = blue

    this.hex = '#' + ('0').repeat(6 - hex.toString(16).length) + hex.toString(16)

    this.count = 1
  }

  getSaturation() {
    if (this.saturation === undefined) {
      this.saturation = Math.max(
        Math.abs(this.red - this.green),
        Math.abs(this.red - this.blue),
        Math.abs(this.green - this.blue)
      )
    }

    return this.saturation
  }
}

Color.dist = (a, b) => Math.abs(a.red - b.red) + Math.abs(a.green - b.green) + Math.abs(a.blue - b.blue)

export default class ColorsExtract {
  constructor (pixels = 20000) {
    this.pixels = pixels
    this.colorsAccuracy = 1 // bits 8 - 4 - 2 - 1
  }

  display2 (colors) {
    var imageData = this.context.createImageData(this.canvas.width, this.canvas.height)
    var pixels = imageData.data

    const height = 10

    loop: for (var r = 0; r < imageData.height; r++) {
      for (var c = 0; c < imageData.width; c++) {
        const i = Math.floor(r / height)

        const color = colors[i]

        if (!color) { break loop }

        // Calculate the position of the current pixel in the array
        var pos = (r * (imageData.width * 4)) + (c * 4)

        // Assign the colour to each pixel
        pixels[pos + 0] = color.red
        pixels[pos + 1] = color.green
        pixels[pos + 2] = color.blue
        pixels[pos + 3] = 255
      }
    }

    const canvas = document.createElement('canvas')
    canvas.width = this.canvas.width
    canvas.height = this.canvas.height
    const context = canvas.getContext('2d')
    context.putImageData(imageData, 0, 0)
    document.body.appendChild(canvas)
  }

  display (list) {
    var imageData = this.context.createImageData(500, 500)
    var pixels = imageData.data

    // Number of mosaic tiles
    var numTileRows = 10
    var numTileCols = 10

    // Dimensions of each tile
    var tileWidth = imageData.width / numTileCols
    var tileHeight = imageData.height / numTileRows

    loop: for (var r = 0; r < numTileRows; r++) {
      for (var c = 0; c < numTileCols; c++) {
        const color = list.shift()

        if (!color) { break loop }

        for (var tr = 0; tr < tileHeight; tr++) {
          for (var tc = 0; tc < tileWidth; tc++) {
            // Calculate the true position of the tile pixel
            var trueRow = (r * tileHeight) + tr
            var trueCol = (c * tileWidth) + tc

            // Calculate the position of the current pixel in the array
            var pos = (trueRow * (imageData.width * 4)) + (trueCol * 4)

            // Assign the colour to each pixel
            pixels[pos + 0] = color.r
            pixels[pos + 1] = color.g
            pixels[pos + 2] = color.b
            pixels[pos + 3] = 255
          }
        }
      }
    }

    this.context.putImageData(imageData, 0, 0)
  }

  process (data) {
    // const mult = 255 / Math.pow(this.colorsAccuracy, 1 / 3)
    const dist = (a, b) => Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b)
    const store = new colorGroup()
    const acc = 3


    for (let i = 0; i < data.length; i += 4) {
      const r = data[i] // 0 -> 255
      const g = data[i + 1]
      const b = data[i + 2]

      const hex = r << 16 | g << 8 | b
      const max = (r >> 4 & 0xF) << 2 | (g >> 4 & 0xF) << 1 | (b >> 4 & 0xF)
      const min = Math.round(r * (acc - 1) / 255) * (acc * acc) + Math.round(g * (acc - 1) / 255) * acc + Math.round(b * (acc - 1) / 255)
      
      let group = store.getGroup(min)
      group = group.getGroup(max)
      group.getColor(hex, r, g, b)
    }

    const colorsBySaturation = store.getColorsByMaxSaturation()

    this.display2(colorsBySaturation)
  }

  start () {
    const currentPixels = this.image.width * this.image.height
    const width = currentPixels < this.pixels ? this.image.width : Math.round(this.image.width * Math.sqrt(this.pixels / currentPixels))
    const height = currentPixels < this.pixels ? this.image.height : Math.round(this.image.height * Math.sqrt(this.pixels / currentPixels))

    this.canvas = document.createElement('canvas')
    this.canvas.width = width
    this.canvas.height = height
    this.context = this.canvas.getContext('2d')
    this.context.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, width, height)
    const imageData = this.context.getImageData(0, 0, width, height)
    this.process(imageData.data)
    // console.log(imageData.data)

    document.body.appendChild(this.canvas)

    this.imageData = this.context.getImageData(0, 0, width, height)
  }

  fromSrc (src) {
    this.image = new Image()
    return new Promise((resolve, reject) => {
      const imageLoaded = () => {
        this.start()
        resolve(this)
      }
      this.image.addEventListener('load', imageLoaded)
      this.image.src = src
    })
  }
}
