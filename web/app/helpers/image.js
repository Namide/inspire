const { pathToSrc } = require('./files.js')

module.exports.validator = () => {
  return {
    bsonType: 'object',
    required: ['width', 'height', 'src'],
    properties: {
      width: {
        bsonType: 'number'
      },
      height: {
        bsonType: 'number'
      },
      src: {
        bsonType: 'string'
      }
    }
  }
}

module.exports.extractData = async (file) => {
  const { loadImage } = require('canvas')
  const { extractColorsFromSrc } = require('extract-colors')
  const fs = require('fs')
  
  const ACCURACY = 4 // 4 * 4 * 4 => 64 colors

  const size = fs.statSync(file.path).size

  const src = pathToSrc(file.path)
  const type = file.mimetype
  const name = file.filename

  const image = await loadImage(file.path)
  const width = image.width
  const height = image.height
  const colorsFull = await extractColorsFromSrc(file.path)

  // optimise test : http://glslsandbox.com/e#61168.1
  const colors = colorsFull.map(color => {
    const round = (
      Math.round((color.red * (ACCURACY - 1)) / 255) * ACCURACY * ACCURACY +
      Math.round((color.green * (ACCURACY - 1)) / 255) * ACCURACY +
      Math.round((color.blue * (ACCURACY - 1)) / 255)
    )

    return {
      hex: color.hex,
      area: color.area,
      saturation: color.saturation,
      round
    }
  })

  return { name, width, height, type, src, size, colors }
}
